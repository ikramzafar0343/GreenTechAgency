"use client";

import { EmployeePageHeader } from "@/components/employee/EmployeePageHeader";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { adminFieldClass } from "@/components/admin/AdminFormModal";
import { useDeliveryMessagesPage, cardClass, messagePreview, SalesMessagesPage } from "./DeliveryMessagesPageModel";
import { useEmployee } from "@/components/employee/EmployeeProvider";
import { EmployeeDomainGate } from "@/components/employee/EmployeeDomainGate";

function DeliveryMessagesPage() {

  const { formId, fileInputId, threadEndRef, pending, uploading, error, threads, selectedClientId, setSelectedClientId, draft, setDraft, pendingFiles, setPendingFiles, selectedThread, onPickFiles, onSend } = useDeliveryMessagesPage();
  return (
    <div className="space-y-6">
      <EmployeePageHeader
        title="Messages"
        lede="Conversations with your assigned clients."
      />

      <div className={cardClass} aria-busy={pending || uploading}>
        <ul className="divide-y divide-black/8 border-b border-black/8 lg:border-r lg:border-b-0">
          {threads.map(({ client, latest, unread }) => {
            const active = client.id === selectedClientId;

            return (
              <li key={client.id}>
                <button
                  type="button"
                  onClick={() => setSelectedClientId(client.id)}
                  className={`w-full px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
                    active ? "bg-brand/10" : "hover:bg-cream"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[0.88rem] font-bold text-[#0d120b]">
                      {client.company}
                    </p>
                    {unread > 0 ? (
                      <span className="size-2 shrink-0 rounded-full bg-logo-gradient" />
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[0.72rem] font-medium text-black/40">
                    {latest?.at}
                  </p>
                  <p className="mt-2 line-clamp-3 text-[0.82rem] font-medium text-black/55">
                    {latest ? messagePreview(latest) : ""}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex min-h-[22rem] flex-col bg-[#fafbf8] p-5 md:p-6">
          {selectedThread ? (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {selectedThread.messages.map((message) => {
                  const isStaff =
                    message.from === "admin" || message.from === "employee";

                  return (
                    <ChatBubble
                      key={message.id}
                      align={isStaff ? "self" : "other"}
                      body={message.body}
                      meta={`${
                        message.from === "client"
                          ? selectedThread.client.name
                          : message.from === "employee"
                            ? "You"
                            : "Admin"
                      } · ${message.at}`}
                      attachments={message.attachments.map((item) => ({
                        fileId: item.fileId,
                        name: item.name,
                      }))}
                    />
                  );
                })}
                <div ref={threadEndRef} />
              </div>

              <form
                id={formId}
                onSubmit={onSend}
                className="mt-4 space-y-3 rounded-2xl border-2 border-secondary bg-white p-3 shadow-[0_4px_16px_rgba(47,58,40,0.04)] focus-within:border-brand"
              >
                {error ? (
                  <p
                    role="alert"
                    className="text-[0.8rem] font-semibold text-[#8a2f2f]"
                  >
                    {error}
                  </p>
                ) : null}
                {pendingFiles.length > 0 ? (
                  <ul className="flex flex-wrap gap-2">
                    {pendingFiles.map((file) => (
                      <li
                        key={file.id}
                        className="inline-flex items-center gap-2 rounded-lg bg-cream px-2.5 py-1.5 text-[0.78rem] font-semibold text-[#0d120b]"
                      >
                        <span className="max-w-[10rem] truncate">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          className="text-black/45 hover:text-[#0d120b]"
                          aria-label={`Remove ${file.name}`}
                          onClick={() =>
                            setPendingFiles((current) =>
                              current.filter((item) => item.id !== file.id),
                            )
                          }
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <textarea
                  rows={3}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write a message…"
                  aria-label="Write a message"
                  className={`${adminFieldClass} resize-none`}
                />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <input
                      id={fileInputId}
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={(event) => {
                        void onPickFiles(event.target.files);
                        event.target.value = "";
                      }}
                    />
                    <label
                      htmlFor={fileInputId}
                      className="inline-flex cursor-pointer rounded-xl border border-black/10 bg-white px-3.5 py-2 text-[0.82rem] font-bold text-[#0d120b] transition-colors hover:bg-cream"
                    >
                      {uploading ? "Uploading…" : "Attach"}
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={pending || uploading}
                    className="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-[0.88rem] font-bold text-cream disabled:opacity-60"
                  >
                    {pending ? "Sending…" : "Send"}
                  </button>
                </div>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function MessagesPage() {
  const { state } = useEmployee();

  if (state.employee.kind === "sales") {
    return (
      <EmployeeDomainGate domain="crm">
        <SalesMessagesPage />
      </EmployeeDomainGate>
    );
  }

  return (
    <EmployeeDomainGate domain="delivery">
      <DeliveryMessagesPage />
    </EmployeeDomainGate>
  );
}
