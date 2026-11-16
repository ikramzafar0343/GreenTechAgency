"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { EmployeePageHeader } from "@/components/employee/EmployeePageHeader";
import { useEmployee } from "@/components/employee/EmployeeProvider";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { adminFieldClass } from "@/components/admin/AdminFormModal";
import type { AdminSalesMessage } from "@/lib/data/admin";
import { createSalesMessageAction, markSalesMessageReadAction } from "@/lib/submitCrm";
import { cardClass, useDeliveryMessagesPage } from "./DeliveryMessagesPageModelPart";
export { cardClass, messagePreview, useDeliveryMessagesPage } from "./DeliveryMessagesPageModelPart";
export type { PendingFile } from "./DeliveryMessagesPageModelPart";

export function SalesMessagesPage() {
  const { state, setSalesMessages } = useEmployee();
  const formId = useId();
  const selfId = state.employee.id;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const peers = state.salesPeers;

  const threads = peers.map((peer) => {
    const messages = state.salesMessages
      .filter(
        (message) =>
          (message.fromRepId === selfId && message.toRepId === peer.id) ||
          (message.fromRepId === peer.id && message.toRepId === selfId),
      )
      .slice()
      .sort((a, b) => a.at.localeCompare(b.at));
    const latest = messages[messages.length - 1];
    const unread = messages.filter(
      (message) => message.toRepId === selfId && !message.read,
    ).length;

    return { peer, messages, latest, unread };
  });

  const [selectedPeerId, setSelectedPeerId] = useState(peers[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const markedReadRef = useRef(new Set<string>());

  const resolvedPeerId =
    peers.length === 0
      ? ""
      : peers.some((peer) => peer.id === selectedPeerId)
        ? selectedPeerId
        : (peers[0]?.id ?? "");

  if (resolvedPeerId !== selectedPeerId) {
    setSelectedPeerId(resolvedPeerId);
  }

  const selectedThread = threads.find(
    (thread) => thread.peer.id === selectedPeerId,
  );

  useEffect(() => {
    if (!selectedPeerId || !selectedThread) {
      return;
    }

    const unreadIds = selectedThread.messages
      .filter(
        (message) =>
          message.toRepId === selfId &&
          message.fromRepId === selectedPeerId &&
          !message.read &&
          !markedReadRef.current.has(message.id),
      )
      .map((message) => message.id);

    if (unreadIds.length === 0) {
      return;
    }

    for (const id of unreadIds) {
      markedReadRef.current.add(id);
    }

    let cancelled = false;
    void (async () => {
      const results = await Promise.all(
        unreadIds.map((id) => markSalesMessageReadAction({ id })),
      );
      if (cancelled) {
        return;
      }
      const updatedById = new Map(
        results
          .filter(
            (
              result,
            ): result is { ok: true; data: AdminSalesMessage } =>
              result.ok && "data" in result,
          )
          .map((result) => [result.data.id, result.data] as const),
      );
      for (const id of unreadIds) {
        if (!updatedById.has(id)) {
          markedReadRef.current.delete(id);
        }
      }
      if (updatedById.size === 0) {
        return;
      }
      setSalesMessages(
        state.salesMessages.map(
          (message) => updatedById.get(message.id) ?? message,
        ),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedPeerId, selectedThread, selfId, setSalesMessages, state.salesMessages]);

  const onSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = draft.trim();

    if (!body || !selectedPeerId || pending) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await createSalesMessageAction({
        toRepId: selectedPeerId,
        body,
      });
      if (result.ok && "data" in result) {
        setSalesMessages([...state.salesMessages, result.data]);
        setDraft("");
        return;
      }
      setError(
        result.reason === "unauthorized"
          ? "Session expired. Sign in again and retry."
          : result.reason === "validation"
            ? "Message could not be sent. Check the peer and try again."
            : "Could not send message. Try again.",
      );
    });
  };

  if (peers.length === 0) {
    return (
      <div className="space-y-6">
        <EmployeePageHeader
          title="Messages"
          lede="1:1 chat with other active sales team members."
        />
        <p className="text-[0.95rem] font-medium text-black/50">
          No other active sales team members are available for chat.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EmployeePageHeader
        title="Messages"
        lede="1:1 chat with other active sales team members."
      />

      <div className={cardClass}>
        <ul className="divide-y divide-black/8 border-b border-black/8 lg:border-r lg:border-b-0">
          {threads.map(({ peer, latest, unread }) => {
            const active = peer.id === selectedPeerId;

            return (
              <li key={peer.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPeerId(peer.id);
                    setError(null);
                  }}
                  className={`w-full px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
                    active ? "bg-brand/10" : "hover:bg-cream"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[0.88rem] font-bold text-[#0d120b]">
                      {peer.name}
                    </p>
                    {unread > 0 ? (
                      <span className="size-2 shrink-0 rounded-full bg-logo-gradient" />
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[0.72rem] font-medium text-black/40">
                    {latest?.at ?? peer.email}
                  </p>
                  <p className="mt-2 line-clamp-3 text-[0.82rem] font-medium text-black/55">
                    {latest?.body ?? "No messages yet."}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex min-h-[20rem] flex-col bg-[#fafbf8] p-5 md:p-6">
          {selectedThread ? (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto">
                {selectedThread.messages.map((message) => {
                  const isSelf = message.fromRepId === selfId;

                  return (
                    <ChatBubble
                      key={message.id}
                      align={isSelf ? "self" : "other"}
                      body={message.body}
                      meta={`${isSelf ? "You" : selectedThread.peer.name} · ${message.at}`}
                      attachments={[]}
                    />
                  );
                })}
              </div>

              {error ? (
                <p className="mt-3 text-[0.82rem] font-semibold text-[#a33]" role="alert">
                  {error}
                </p>
              ) : null}

              <form id={formId} onSubmit={onSend} className="mt-4 flex gap-2">
                <input
                  className={adminFieldClass}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write a message…"
                  aria-label="Write a message"
                  disabled={pending}
                />
                <button
                  type="submit"
                  disabled={pending || draft.trim().length === 0}
                  className="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-[0.88rem] font-bold text-cream disabled:opacity-60"
                >
                  {pending ? "Sending…" : "Send"}
                </button>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export type DeliveryMessagesPageModel = ReturnType<typeof useDeliveryMessagesPage>;
