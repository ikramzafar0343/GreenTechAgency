"use client";

import { ContactArrowButton } from "@/features/contact/components/ContactArrowButton";
import { CONTACT_BUDGET_BANDS, CONTACT_BUDGET_CURRENCY, CONTACT_CAREERS_ROLES, CONTACT_CHOICES, CONTACT_PROMPTS } from "@/features/contact/model/contactPageContent";
import styles from "@/features/contact/styles/contactPage.module.css";
import { useContactFlow, type ContactFlowProps } from "./ContactFlowModel";
import { ContactFlowSection1, ContactFlowSection2, ContactFlowSection3 } from "./ContactFlowSections";

export function ContactFlow({ serviceChips }: ContactFlowProps) {
  const model = useContactFlow({ serviceChips });
  const { state, dispatch, greeting, panelRef, screenRef, headingRef } = model;
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
              <ContactFlowSection1 model={model} />
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
              <ContactFlowSection2 model={model} />
            ) : null}

            {state.screen === "general" ? (
              <ContactFlowSection3 model={model} />
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
