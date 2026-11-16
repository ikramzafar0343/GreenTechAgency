"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { useEmployee } from "@/components/employee/EmployeeProvider";
import type { AdminMessage } from "@/lib/data/admin";
import { createDeliveryMessageAction, markDeliveryMessageReadAction, uploadDeliveryFileAction } from "@/lib/submitEmployeeDelivery";

export const cardClass =
  "grid overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_24px_rgba(47,58,40,0.04)] lg:grid-cols-[18rem_1fr]";

export function messagePreview(message: AdminMessage): string {
  if (message.body.trim().length > 0) {
    return message.body;
  }
  if (message.attachments.length > 0) {
    return message.attachments.map((item) => item.name).join(", ");
  }
  return "";
}

export type PendingFile = {
  readonly id: string;
  readonly name: string;
};

/** All state and handlers of <DeliveryMessagesPage>; the component and its sections only render. */
export function useDeliveryMessagesPage() {
  const { state, setMessages } = useEmployee();
  const formId = useId();
  const fileInputId = useId();
  const threadEndRef = useRef<HTMLDivElement>(null);
  const markedRef = useRef<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const threads = state.clients
    .map((client) => {
      const messages = state.messages
        .filter((m) => m.clientId === client.id)
        .slice()
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      const latest = messages[messages.length - 1];
      const unread = messages.filter(
        (m) => !m.read && m.from === "client",
      ).length;

      return { client, messages, latest, unread };
    })
    .filter((thread) => thread.latest);

  const [selectedClientId, setSelectedClientId] = useState(
    threads[0]?.client.id ?? "",
  );
  const [draft, setDraft] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  const selectedThread = threads.find(
    (thread) => thread.client.id === selectedClientId,
  );

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedThread?.messages.length, pendingFiles.length]);

  useEffect(() => {
    if (!selectedClientId || !selectedThread) {
      return;
    }

    const unread = selectedThread.messages.filter(
      (message) =>
        message.from === "client" &&
        !message.read &&
        !markedRef.current.has(message.id),
    );
    if (unread.length === 0) {
      return;
    }

    void (async () => {
      const updates = new Map<string, AdminMessage>();
      for (const message of unread) {
        markedRef.current.add(message.id);
        const result = await markDeliveryMessageReadAction({ id: message.id });
        if (result.ok && "data" in result) {
          updates.set(message.id, result.data);
        }
      }
      if (updates.size === 0) {
        return;
      }
      setMessages(
        state.messages.map((message) => updates.get(message.id) ?? message),
      );
    })();
  }, [selectedClientId, selectedThread, setMessages, state.messages]);

  const onPickFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedClientId) {
      return;
    }
    setError(null);
    setUploading(true);
    const next: PendingFile[] = [];
    for (const file of Array.from(files)) {
      if (pendingFiles.length + next.length >= 10) {
        break;
      }
      const formData = new FormData();
      formData.set("clientId", selectedClientId);
      formData.set("kind", "chat");
      formData.set("file", file);
      const result = await uploadDeliveryFileAction(formData);
      if (!result.ok || !("data" in result)) {
        setError("Could not attach file. Try again.");
        break;
      }
      next.push({ id: result.data.id, name: result.data.name });
    }
    if (next.length > 0) {
      setPendingFiles((current) => [...current, ...next]);
    }
    setUploading(false);
  };

  const onSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = draft.trim();

    if ((!body && pendingFiles.length === 0) || !selectedClientId) {
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await createDeliveryMessageAction({
        clientId: selectedClientId,
        body,
        fileIds: pendingFiles.map((item) => item.id),
      });
      if (result.ok && "data" in result) {
        setMessages([...state.messages, result.data]);
        setDraft("");
        setPendingFiles([]);
        return;
      }
      setError("Could not send message. Try again.");
    });
  };
  return { formId, fileInputId, threadEndRef, pending, uploading, error, threads, selectedClientId, setSelectedClientId, draft, setDraft, pendingFiles, setPendingFiles, selectedThread, onPickFiles, onSend };
}
