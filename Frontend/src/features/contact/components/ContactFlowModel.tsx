"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { submitCareersEnquiry, submitGeneralEnquiry, submitProjectEnquiry } from "@/features/contact/actions/submitBranchEnquiry";
import { CONTACT_PROMPTS, choiceGreeting, greetingPeriod } from "@/features/contact/model/contactPageContent";
import type { ContactServiceChip } from "@/features/services/server/getContactServiceCatalog";
import { contactFlowReducer, INITIAL_CONTACT_FLOW } from "@/features/contact/model/contactFlowState";
import { useContactPanelMotion } from "@/features/contact/hooks/useContactPanelMotion";

export type ContactFlowProps = {
  serviceChips: readonly ContactServiceChip[];
};

/** All state and handlers of <ContactFlow>; the component and its sections only render. */
export function useContactFlow({ serviceChips }: ContactFlowProps) {
  const [state, dispatch] = useReducer(contactFlowReducer, INITIAL_CONTACT_FLOW);
  const [greeting, setGreeting] = useState<string>(CONTACT_PROMPTS.choice);
  const panelRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useContactPanelMotion({
    panelRef,
    screenRef,
    screenKey: state.screen,
  });

  useEffect(() => {
    setGreeting(choiceGreeting(greetingPeriod()));
  }, []);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [state.screen]);

  useEffect(() => {
    if (state.screen === "choice") return;
    const panel = panelRef.current;
    if (!panel) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = panel.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }, [state.screen]);

  async function handleSubmit() {
    dispatch({ type: "submitStart" });
    let result;
    if (state.screen === "projectDetails") {
      result = await submitProjectEnquiry(state.project);
    } else if (state.screen === "careersDetails") {
      result = await submitCareersEnquiry(state.careers);
    } else {
      result = await submitGeneralEnquiry(state.general);
    }
    dispatch({ type: "submitResult", result });
  }
  return { state, dispatch, greeting, panelRef, screenRef, headingRef, handleSubmit };
}

export type ContactFlowModel = ReturnType<typeof useContactFlow>;
