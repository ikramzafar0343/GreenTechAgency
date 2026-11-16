"use client";

import { Link } from "@/i18n/navigation";
import { ContactArrowButton } from "@/features/contact/components/ContactArrowButton";
import { ContactHoneypot, ContactTextArea, ContactTextField } from "@/features/contact/components/ContactFormFields";
import { CONTACT_FOOTER, CONTACT_PROMPTS } from "@/features/contact/model/contactPageContent";
import styles from "@/features/contact/styles/contactPage.module.css";
import { type ContactFlowModel } from "./ContactFlowModel";

export function ContactFlowSection1({ model }: { model: ContactFlowModel }) {
  const { headingRef, state, handleSubmit, dispatch } = model;
  return (
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
  );
}
