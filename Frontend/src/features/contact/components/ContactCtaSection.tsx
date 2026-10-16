import { ContactEnquiryForm } from "@/features/contact/components/ContactEnquiryForm";
import styles from "@/features/contact/styles/contact.module.css";

export function ContactCtaSection() {
  return (
    <section
      id="contact"
      className={styles.section}
      aria-labelledby="contact-heading"
      data-contact-section
    >
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.gridPattern} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.layout}>
          <header className={styles.intro}>
            <p className={`${styles.eyebrow} typeEyebrow`}>Start a Project</p>
            <h2
              id="contact-heading"
              className={`${styles.heading} typeSectionTitle`}
            >
              Tell Us What You Want to Build
            </h2>
            <p className={`${styles.supporting} typeLead`}>
              Share your goals, timeline, and challenges. We will review your
              brief and recommend a clear next step for your digital project.
            </p>

            <ul className={styles.channels}>
              <li className={styles.channel}>
                <span
                  className={`${styles.channelIndex} typeMeta`}
                  aria-hidden="true"
                >
                  01
                </span>
                <span>
                  <span className={`${styles.channelLabel} typeMeta`}>
                    Response
                  </span>
                  <span className={`${styles.channelText} typeBody`}>
                    We review new project briefs on business days.
                  </span>
                </span>
              </li>
              <li className={styles.channel}>
                <span
                  className={`${styles.channelIndex} typeMeta`}
                  aria-hidden="true"
                >
                  02
                </span>
                <span>
                  <span className={`${styles.channelLabel} typeMeta`}>
                    Best next step
                  </span>
                  <span className={`${styles.channelText} typeBody`}>
                    Include goals, links, and a preferred timeline in the form.
                  </span>
                </span>
              </li>
              <li className={styles.channel}>
                <span
                  className={`${styles.channelIndex} typeMeta`}
                  aria-hidden="true"
                >
                  03
                </span>
                <span>
                  <span className={`${styles.channelLabel} typeMeta`}>
                    What happens next
                  </span>
                  <span className={`${styles.channelText} typeBody`}>
                    We reply with a recommended approach and the following steps.
                  </span>
                </span>
              </li>
            </ul>
          </header>

          <div className={styles.formPanel}>
            <div className={styles.formAccent} aria-hidden="true" />
            <div className={styles.formHeader}>
              <p className={`${styles.formEyebrow} typeEyebrow`}>
                Project brief
              </p>
              <p className={`${styles.formLead} typeLead`}>
                A few details help us prepare a useful first conversation.
              </p>
            </div>
            <ContactEnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
