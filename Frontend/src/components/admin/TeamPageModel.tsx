"use client";

import { useMemo, useState, useTransition } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { adminIcons } from "@/components/admin/AdminIcons";
import type { AdminTeamMember } from "@/lib/data/admin";
import { archiveAdminTeamMemberAction, createAdminTeamMemberAction, reorderAdminTeamMemberAction, updateAdminTeamMemberAction } from "@/lib/submitAdminTeam";

export const cardClass =
  "overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_24px_rgba(47,58,40,0.04)]";

export type TeamForm = {
  name: string;
  role: string;
  bio: string;
  image: string;
  active: boolean;
  employeeId: string;
};

export const emptyForm: TeamForm = {
  name: "",
  role: "",
  bio: "",
  image: "",
  active: true,
  employeeId: "",
};

export function nextSortOrder(team: readonly AdminTeamMember[]): number {
  if (team.length === 0) {
    return 0;
  }
  return Math.max(...team.map((item) => item.sortOrder)) + 1;
}

/** All state and handlers of <TeamPage>; the component and its sections only render. */
export function useTeamPage() {
  const { state, setTeam } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<TeamForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const EditIcon = adminIcons.edit;
  const TrashIcon = adminIcons.trash;
  const ChevronUpIcon = adminIcons.chevronUp;
  const ChevronDownIcon = adminIcons.chevronDown;

  const sortedTeam = useMemo(
    () => [...state.team].sort((a, b) => a.sortOrder - b.sortOrder),
    [state.team],
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (item: AdminTeamMember) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      bio: item.bio,
      image: item.image,
      active: item.active,
      employeeId: item.employeeId ?? "",
    });
    setError(null);
    setModalOpen(true);
  };

  const save = () => {
    const name = form.name.trim();
    if (!name) {
      return;
    }

    startTransition(async () => {
      setError(null);
      const employeeId = form.employeeId || null;

      if (editingId) {
        const existing = state.team.find((item) => item.id === editingId);
        if (!existing) {
          setError("Team member not found.");
          return;
        }

        const result = await updateAdminTeamMemberAction({
          id: existing.id,
          version: existing.version,
          name,
          role: form.role.trim(),
          bio: form.bio.trim(),
          image: form.image,
          employeeId,
          sortOrder: existing.sortOrder,
          active: form.active,
          publishedAt: existing.publishedAt,
          socials: existing.socials,
        });

        if (!result.ok || !("member" in result)) {
          setError(
            result.ok
              ? "Save failed."
              : result.reason === "conflict"
                ? "This member was updated elsewhere. Refresh and try again."
                : "Could not save team member.",
          );
          return;
        }

        setTeam(
          state.team.map((item) =>
            item.id === editingId ? result.member : item,
          ),
        );
      } else {
        const result = await createAdminTeamMemberAction({
          name,
          role: form.role.trim(),
          bio: form.bio.trim(),
          image: form.image,
          employeeId,
          sortOrder: nextSortOrder(state.team),
          active: form.active,
          socials: [],
        });

        if (!result.ok || !("member" in result)) {
          setError("Could not create team member.");
          return;
        }

        setTeam([...state.team, result.member]);
      }

      setModalOpen(false);
    });
  };

  const confirmDelete = () => {
    if (!deleteId) {
      return;
    }

    const existing = state.team.find((item) => item.id === deleteId);
    if (!existing) {
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await archiveAdminTeamMemberAction({
        id: existing.id,
        version: existing.version,
      });

      if (!result.ok) {
        setError(
          result.reason === "conflict"
            ? "This member was updated elsewhere. Refresh and try again."
            : "Could not delete team member.",
        );
        return;
      }

      setTeam(state.team.filter((item) => item.id !== deleteId));
      setDeleteOpen(false);
      setDeleteId(null);
    });
  };

  const move = (index: number, direction: "up" | "down") => {
    const neighborIndex = direction === "up" ? index - 1 : index + 1;
    const current = sortedTeam[index];
    const neighbor = sortedTeam[neighborIndex];
    if (!current || !neighbor) {
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await reorderAdminTeamMemberAction({
        items: [
          {
            id: current.id,
            sortOrder: neighbor.sortOrder,
            version: current.version,
          },
          {
            id: neighbor.id,
            sortOrder: current.sortOrder,
            version: neighbor.version,
          },
        ],
      });

      if (!result.ok) {
        setError(
          result.reason === "conflict"
            ? "Order changed elsewhere. Refresh and try again."
            : "Could not reorder team member.",
        );
        return;
      }

      setTeam(
        state.team.map((item) => {
          if (item.id === current.id) {
            return {
              ...item,
              sortOrder: neighbor.sortOrder,
              version: item.version + 1,
            };
          }
          if (item.id === neighbor.id) {
            return {
              ...item,
              sortOrder: current.sortOrder,
              version: item.version + 1,
            };
          }
          return item;
        }),
      );
    });
  };

  const deleteTarget = state.team.find((item) => item.id === deleteId);
  return { state, modalOpen, setModalOpen, deleteOpen, setDeleteOpen, editingId, setDeleteId, form, setForm, error, pending, EditIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, sortedTeam, openAdd, openEdit, save, confirmDelete, move, deleteTarget };
}

export type TeamPageModel = ReturnType<typeof useTeamPage>;
