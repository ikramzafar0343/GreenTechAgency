"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  submitCareersEnquiry,
  submitGeneralEnquiry,
  submitProjectEnquiry,
} from "@/features/contact/actions/submitBranchEnquiry";
import { ContactArrowButton } from "@/features/contact/components/ContactArrowButton";
import {
  ContactHoneypot,
  ContactTextArea,
  ContactTextField,
} from "@/features/contact/components/ContactFormFields";
import {
  CONTACT_BUDGET_BANDS,
  CONTACT_BUDGET_CURRENCY,
  CONTACT_CAREERS_ROLES,
  CONTACT_CHOICES,
  CONTACT_FOOTER,
  CONTACT_PROMPTS,
  choiceGreeting,
  greetingPeriod,
} from "@/features/contact/model/contactPageContent";
import type { ContactServiceChip } from "@/features/services/server/getContactServiceCatalog";
import {
  contactFlowReducer,
  INITIAL_CONTACT_FLOW,
} from "@/features/contact/model/contactFlowState";
import { useContactPanelMotion } from "@/features/contact/hooks/useContactPanelMotion";
import styles from "@/features/contact/styles/contactPage.module.css";

type ContactFlowProps = {
  serviceChips: readonly ContactServiceChip[];
};

export function ContactFlow({ serviceChips }: ContactFlowProps) {
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

  return (
    <section
      id="contact-enquiry"
      className={styles.panelSection}
      aria-labelledby="contact-flow-heading"
    >
      <div className={styles.panel} ref={panelRef} data-contact-panel>
        <div className={styles.panelInner}>
          <div
            className={`${styles.step} ${
              state.screen === "projectServices" ? styles.stepWide : ""
            }`}
            ref={screenRef}
            key={state.screen}
            data-contact-screen={state.screen}
          >
            {state.screen === "choice" ? (
              <div className={styles.stepCentered}>
                <h2
                  id="contact-flow-heading"
                  ref={headingRef}
                  tabIndex={-1}
                  className={`${styles.prompt} ${styles.promptScale} ${styles.promptStack}`}
                  data-contact-prompt
                >
                  <span>{greeting}</span>
                  <span>{CONTACT_PROMPTS.choiceLine2}</span>
                </h2>
                <div className={styles.choiceRow} data-contact-controls>
                  {CONTACT_CHOICES.map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      className={styles.choicePill}
                      onClick={() =>
                        dispatch({ type: "selectChoice", choice: choice.id })
                      }
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {state.screen === "projectServices" ? (
              <div className={styles.stepCentered}>
                <h2
                  id="contact-flow-heading"
                  ref={headingRef}
                  tabIndex={-1}
                  className={`${styles.prompt} ${styles.promptScale}`}
                  data-contact-prompt
                >
                  {CONTACT_PROMPTS.projectServices}
                </h2>
                <div className={styles.chipCloud} data-contact-controls>
                  {serviceChips.map((service) => {
                    const selected = state.project.serviceIds.includes(
                      service.id,
                    );
                    return (
                      <button
                        key={service.id}
                        type="button"
                        className={`${styles.chip} ${selected ? styles.chipSelected : ""}`}
                        aria-pressed={selected}
                        onClick={() =>
                          dispatch({
                            type: "toggleService",
                            serviceId: service.id,
                          })
                        }
                      >
                        {service.label}
                      </button>
                    );
                  })}
                </div>
                {state.servicesHint ? (
                  <p className={styles.hint} role="status">
                    {CONTACT_PROMPTS.servicesEmptyHint}
                  </p>
                ) : null}
                <div className={styles.stepActions}>
                  <ContactArrowButton
                    direction="left"
                    label="Go back"
                    onClick={() => dispatch({ type: "goBack" })}
                  />
                  <ContactArrowButton
                    label="Continue"
                    onClick={() => dispatch({ type: "continueServices" })}
                  />
                </div>
              </div>
            ) : null}

            {state.screen === "projectBudget" ? (
              <div className={styles.stepCentered}>
                <h2
                  id="contact-flow-heading"
                  ref={headingRef}
                  tabIndex={-1}
                  className={`${styles.prompt} ${styles.promptScale}`}
                  data-contact-prompt
                >
                  {CONTACT_PROMPTS.projectBudget}
                </h2>
                <p className={styles.hint} style={{ color: "inherit" }}>
                  Budget currency: {CONTACT_BUDGET_CURRENCY}
                </p>
                <div className={styles.chipGrid} data-contact-controls>
                  {CONTACT_BUDGET_BANDS.map((band) => (
                    <button
                      key={band.id}
                      type="button"
                      className={`${styles.chip} ${
                        state.project.budgetId === band.id
                          ? styles.chipSelected
                          : ""
                      }`}
                      onClick={() =>
                        dispatch({ type: "selectBudget", budgetId: band.id })
                      }
                    >
                      {band.label}
                    </button>
                  ))}
                </div>
                <div className={styles.stepActions}>
                  <ContactArrowButton
                    direction="left"
                    label="Go back"
                    onClick={() => dispatch({ type: "goBack" })}
                  />
                </div>
              </div>
            ) : null}

            {state.screen === "projectDetails" ? (
              <div className={styles.formDetail}>
                <div className={styles.formToolbar}>
                  <Link
                    className={styles.formWorkLink}
                    href={CONTACT_FOOTER.workCta.href}
                  >
                    <span>{CONTACT_PROMPTS.viewWorkLabel}</span>
                    <span className={styles.formWorkArrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
                <header className={styles.formHeader}>
                  <p className={styles.formEyebrow}>
                    {CONTACT_PROMPTS.projectDetailsEyebrow}
                  </p>
                  <h2
                    id="contact-flow-heading"
                    ref={headingRef}
                    tabIndex={-1}
                    className={styles.formTitle}
                    data-contact-prompt
                  >
                    {CONTACT_PROMPTS.projectDetails}
                  </h2>
                </header>
                {state.statusMessage ? (
                  <p className={styles.statusBanner} role="alert">
                    {state.statusMessage}
                  </p>
                ) : null}
                <form
                  className={styles.form}
                  data-contact-controls
                  onSubmit={(event) => {
                    event.preventDefault();
                    void handleSubmit();
                  }}
                >
                  <div className={`${styles.formRow} ${styles.formRowSplit}`}>
                    <ContactTextField
                      id="project-name"
                      name="name"
                      label="Full Name"
                      value={state.project.name}
                      error={state.fieldErrors.name}
                      autoComplete="name"
                      onChange={(value) =>
                        dispatch({ type: "patchProject", patch: { name: value } })
                      }
                    />
                    <ContactTextField
                      id="project-email"
                      name="email"
                      label="Email"
                      type="email"
                      value={state.project.email}
                      error={state.fieldErrors.email}
                      autoComplete="email"
                      onChange={(value) =>
                        dispatch({
                          type: "patchProject",
                          patch: { email: value },
                        })
                      }
                    />
                  </div>
                  <div className={`${styles.formRow} ${styles.formRowSplit}`}>
                    <ContactTextField
                      id="project-company"
                      name="company"
                      label="Company"
                      value={state.project.company}
                      error={state.fieldErrors.company}
                      autoComplete="organization"
                      onChange={(value) =>
                        dispatch({
                          type: "patchProject",
                          patch: { company: value },
                        })
                      }
                    />
                    <ContactTextField
                      id="project-phone"
                      name="phone"
                      label="Phone"
                      type="tel"
                      value={state.project.phone}
                      error={state.fieldErrors.phone}
                      autoComplete="tel"
                      onChange={(value) =>
                        dispatch({
                          type: "patchProject",
                          patch: { phone: value },
                        })
                      }
                    />
                  </div>
                  <ContactTextArea
                    id="project-description"
                    name="description"
                    label="Description"
                    value={state.project.description}
                    error={state.fieldErrors.description}
                    onChange={(value) =>
                      dispatch({
                        type: "patchProject",
                        patch: { description: value },
                      })
                    }
                  />
                  <ContactHoneypot
                    value={state.project.website}
                    onChange={(value) =>
                      dispatch({
                        type: "patchProject",
                        patch: { website: value },
                      })
                    }
                  />
                  <div className={`${styles.stepActions} ${styles.formActions}`}>
                    <ContactArrowButton
                      direction="left"
                      label="Go back"
                      onClick={() => dispatch({ type: "goBack" })}
                      disabled={state.submitting}
                    />
                    <ContactArrowButton
                      type="submit"
                      label={state.submitting ? "Sending…" : "Submit"}
                      disabled={state.submitting}
                    />
                  </div>
                </form>
              </div>
            ) : null}

            {state.screen === "careersRole" ? (
              <div className={styles.stepCentered}>
                <h2
                  id="contact-flow-heading"
                  ref={headingRef}
                  tabIndex={-1}
                  className={`${styles.prompt} ${styles.promptScale}`}
                  data-contact-prompt
                >
                  {CONTACT_PROMPTS.careersRole}
                </h2>
                <p className={styles.careersNote}>{CONTACT_PROMPTS.careersRoleNote}</p>
                <div className={styles.chipGrid} data-contact-controls>
                  {CONTACT_CAREERS_ROLES.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      className={styles.chip}
                      onClick={() =>
                        dispatch({ type: "selectRole", roleId: role.id })
                      }
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
                <div className={styles.stepActions}>
                  <ContactArrowButton
                    direction="left"
                    label="Go back"
                    onClick={() => dispatch({ type: "goBack" })}
                  />
                </div>
              </div>
            ) : null}

            {state.screen === "careersDetails" ? (
              <div className={styles.formDetail}>
                <header className={styles.formHeader}>
                  <h2
                    id="contact-flow-heading"
                    ref={headingRef}
                    tabIndex={-1}
                    className={styles.formTitle}
                    data-contact-prompt
                  >
                    {CONTACT_PROMPTS.careersDetails}
                  </h2>
                </header>
                {state.statusMessage ? (
                  <p className={styles.statusBanner} role="alert">
                    {state.statusMessage}
                  </p>
                ) : null}
                <form
                  className={styles.form}
                  data-contact-controls
                  onSubmit={(event) => {
                    event.preventDefault();
                    void handleSubmit();
                  }}
                >
                  <div className={`${styles.formRow} ${styles.formRowSplit}`}>
                    <ContactTextField
                      id="careers-name"
                      name="name"
                      label="Full name"
                      value={state.careers.name}
                      error={state.fieldErrors.name}
                      autoComplete="name"
                      onChange={(value) =>
                        dispatch({ type: "patchCareers", patch: { name: value } })
                      }
                    />
                    <ContactTextField
                      id="careers-email"
                      name="email"
                      label="Email"
                      type="email"
                      value={state.careers.email}
                      error={state.fieldErrors.email}
                      autoComplete="email"
                      onChange={(value) =>
                        dispatch({
                          type: "patchCareers",
                          patch: { email: value },
                        })
                      }
                    />
                  </div>
                  <ContactTextField
                    id="careers-portfolio"
                    name="portfolio"
                    label="Portfolio link"
                    type="url"
                    value={state.careers.portfolio}
                    error={state.fieldErrors.portfolio}
                    autoComplete="url"
                    onChange={(value) =>
                      dispatch({
                        type: "patchCareers",
                        patch: { portfolio: value },
                      })
                    }
                  />
                  <ContactTextArea
                    id="careers-application"
                    name="application"
                    label="Application"
                    value={state.careers.application}
                    error={state.fieldErrors.application}
                    onChange={(value) =>
                      dispatch({
                        type: "patchCareers",
                        patch: { application: value },
                      })
                    }
                  />
                  <ContactHoneypot
                    value={state.careers.website}
                    onChange={(value) =>
                      dispatch({
                        type: "patchCareers",
                        patch: { website: value },
                      })
                    }
                  />
                  <div className={`${styles.stepActions} ${styles.formActions}`}>
                    <ContactArrowButton
                      direction="left"
                      label="Go back"
                      onClick={() => dispatch({ type: "goBack" })}
                      disabled={state.submitting}
                    />
                    <ContactArrowButton
                      type="submit"
                      label={state.submitting ? "Sending…" : "Submit"}
                      disabled={state.submitting}
                    />
                  </div>
                </form>
              </div>
            ) : null}

            {state.screen === "general" ? (
              <div className={styles.formDetail}>
                <header className={styles.formHeader}>
                  <h2
                    id="contact-flow-heading"
                    ref={headingRef}
                    tabIndex={-1}
                    className={styles.formTitle}
                    data-contact-prompt
                  >
                    {CONTACT_PROMPTS.general}
                  </h2>
                </header>
                {state.statusMessage ? (
                  <p className={styles.statusBanner} role="alert">
                    {state.statusMessage}
                  </p>
                ) : null}
                <form
                  className={styles.form}
                  data-contact-controls
                  onSubmit={(event) => {
                    event.preventDefault();
                    void handleSubmit();
                  }}
                >
                  <ContactTextField
                    id="general-name"
                    name="name"
                    label="Full name"
                    value={state.general.name}
                    error={state.fieldErrors.name}
                    autoComplete="name"
                    onChange={(value) =>
                      dispatch({ type: "patchGeneral", patch: { name: value } })
                    }
                  />
                  <div className={`${styles.formRow} ${styles.formRowSplit}`}>
                    <ContactTextField
                      id="general-email"
                      name="email"
                      label="Email"
                      type="email"
                      value={state.general.email}
                      error={state.fieldErrors.email}
                      autoComplete="email"
                      onChange={(value) =>
                        dispatch({
                          type: "patchGeneral",
                          patch: { email: value },
                        })
                      }
                    />
                    <ContactTextField
                      id="general-phone"
                      name="phone"
                      label="Phone"
                      type="tel"
                      value={state.general.phone}
                      error={state.fieldErrors.phone}
                      autoComplete="tel"
                      onChange={(value) =>
                        dispatch({
                          type: "patchGeneral",
                          patch: { phone: value },
                        })
                      }
                    />
                  </div>
                  <ContactTextArea
                    id="general-message"
                    name="message"
                    label="Message"
                    value={state.general.message}
                    error={state.fieldErrors.message}
                    onChange={(value) =>
                      dispatch({
                        type: "patchGeneral",
                        patch: { message: value },
                      })
                    }
                  />
                  <ContactHoneypot
                    value={state.general.website}
                    onChange={(value) =>
                      dispatch({
                        type: "patchGeneral",
                        patch: { website: value },
                      })
                    }
                  />
                  <div className={`${styles.stepActions} ${styles.formActions}`}>
                    <ContactArrowButton
                      direction="left"
                      label="Go back"
                      onClick={() => dispatch({ type: "goBack" })}
                      disabled={state.submitting}
                    />
                    <ContactArrowButton
                      type="submit"
                      label={state.submitting ? "Sending…" : "Submit"}
                      disabled={state.submitting}
                    />
                  </div>
                </form>
              </div>
            ) : null}

            {state.screen === "success" || state.screen === "unavailable" ? (
              <div className={styles.successBlock} data-contact-controls>
                <h2
                  id="contact-flow-heading"
                  ref={headingRef}
                  tabIndex={-1}
                  className={styles.promptScale}
                  data-contact-prompt
                >
                  {state.screen === "success"
                    ? CONTACT_PROMPTS.successTitle
                    : CONTACT_PROMPTS.unavailableTitle}
                </h2>
                <p>
                  {state.screen === "success"
                    ? CONTACT_PROMPTS.successBody
                    : (state.statusMessage ?? CONTACT_PROMPTS.unavailableBody)}
                </p>
                <ContactArrowButton
                  direction="left"
                  label="Back to choices"
                  onClick={() => dispatch({ type: "returnToChoice" })}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
