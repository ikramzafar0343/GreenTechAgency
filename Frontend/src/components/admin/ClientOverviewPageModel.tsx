"use client";

import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";

export const cardClass =
  "rounded-2xl border border-black/8 bg-white p-5 shadow-[0_8px_24px_rgba(47,58,40,0.04)] md:p-6";

export type ContactForm = {
  name: string;
  email: string;
  company: string;
  phone: string;
  location: string;
  plan: string;
  clientContactTitle: string;
  status: "active" | "paused";
  memberSince: string;
};

/** All state and handlers of <ClientOverviewPage>; the component and its sections only render. */
export function useClientOverviewPage() {
  const params = useParams();
  const { state, setClients } = useAdmin();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const clientId = typeof params.id === "string" ? params.id : "";
  const client = state.clients.find((item) => item.id === clientId);
  const [formClientId, setFormClientId] = useState(clientId);
  const [form, setForm] = useState<ContactForm | null>(
    client
      ? {
          name: client.name,
          email: client.email,
          company: client.company,
          phone: client.phone,
          location: client.location,
          plan: client.plan,
          clientContactTitle: client.clientContactTitle,
          status: client.status,
          memberSince: client.memberSince,
        }
      : null,
  );

  if (clientId !== formClientId) {
    setFormClientId(clientId);
    setError(null);
    setSaved(false);
    setForm(
      client
        ? {
            name: client.name,
            email: client.email,
            company: client.company,
            phone: client.phone,
            location: client.location,
            plan: client.plan,
            clientContactTitle: client.clientContactTitle,
            status: client.status,
            memberSince: client.memberSince,
          }
        : null,
    );
  }
  return { state, setClients, pending, startTransition, error, setError, saved, setSaved, clientId, client, form, setForm };
}

export type ClientOverviewPageModel = ReturnType<typeof useClientOverviewPage>;
