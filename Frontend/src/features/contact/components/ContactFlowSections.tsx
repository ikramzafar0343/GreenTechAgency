"use client";

import { ContactArrowButton } from "@/features/contact/components/ContactArrowButton";
import { ContactHoneypot, ContactTextArea, ContactTextField } from "@/features/contact/components/ContactFormFields";
import { CONTACT_PROMPTS } from "@/features/contact/model/contactPageContent";
import styles from "@/features/contact/styles/contactPage.module.css";
import { type ContactFlowModel } from "./ContactFlowModel";
export { ContactFlowSection1 } from "./ContactFlowSectionsPart";

export function ContactFlowSection2({ model }: { model: ContactFlowModel }) {
  const { headingRef, state, handleSubmit, dispatch } = model;
  return (
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
  );
}

export function ContactFlowSection3({ model }: { model: ContactFlowModel }) {
  const { headingRef, state, handleSubmit, dispatch } = model;
  return (
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
  );
}
