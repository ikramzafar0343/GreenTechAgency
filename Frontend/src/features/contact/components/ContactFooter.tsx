"use client";

import { Link } from "@/i18n/navigation";
import { Fragment, useRef } from "react";
import { FaBehance } from "react-icons/fa";
import {
  FiArrowRight,
  FiArrowUp,
  FiDribbble,
  FiFacebook,
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiShare2,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import {
  CONTACT_ASSETS,
  CONTACT_BRAND_NAME,
  CONTACT_FOOTER,
} from "@/features/contact/model/contactPageContent";
import { useContactFooterMotion } from "@/features/contact/hooks/useContactFooterMotion";
import type { FooterSocialLink } from "@/features/footer/model/types";
import styles from "@/features/contact/styles/contactPage.module.css";

const SOCIAL_ICONS: Record<string, IconType> = {
  linkedin: FiLinkedin,
  instagram: FiInstagram,
  facebook: FiFacebook,
  youtube: FiYoutube,
  github: FiGithub,
  dribbble: FiDribbble,
  behance: FaBehance,
  twitter: FiTwitter,
  x: FiTwitter,
};

type ContactFooterProps = {
  socialLinks: FooterSocialLink[];
  year: number;
};

export function ContactFooter({ socialLinks, year }: ContactFooterProps) {
  const rootRef = useRef<HTMLElement>(null);
  useContactFooterMotion(rootRef);

  function goUp() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  const orderedSocial = [...socialLinks].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <footer className={styles.footer} ref={rootRef} data-contact-footer>
      <div className={styles.footerFloat} data-contact-footer-float>
        <div
          className={styles.footerFloatInner}
          data-contact-footer-float-inner
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CONTACT_ASSETS.footerRender}
            alt=""
            width={CONTACT_ASSETS.footerRenderWidth}
            height={CONTACT_ASSETS.footerRenderHeight}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className={styles.footerStack}>
        <div className={styles.footerPanel} data-contact-footer-panel>
          <div className={styles.footerBrand} data-contact-footer-brand>
            <p className={styles.footerCopyright}>
              © {year} {CONTACT_BRAND_NAME}
            </p>
            <p className={styles.footerDescriptor}>
              {CONTACT_FOOTER.descriptor}
            </p>
            {orderedSocial.length > 0 ? (
              <ul className={styles.footerSocial} aria-label="Social profiles">
                {orderedSocial.map((link, index) => {
                  const Icon =
                    SOCIAL_ICONS[link.platform.toLowerCase()] ?? FiShare2;
                  return (
                    <Fragment key={link.id}>
                      {index > 0 ? (
                        <li aria-hidden="true" className={styles.socialSepItem}>
                          <span
                            className={styles.socialSep}
                            data-contact-footer-sep
                          >
                            ✦
                          </span>
                        </li>
                      ) : null}
                      <li>
                        <a
                          className={styles.socialLink}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.label}
                          title={link.label}
                        >
                          <Icon aria-hidden="true" focusable="false" size={18} />
                        </a>
                      </li>
                    </Fragment>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>

        <div className={styles.footerTray} data-contact-footer-tray>
          <ul className={styles.trayLinks}>
            {CONTACT_FOOTER.trayLinks.map((item) => (
              <li key={item.href}>
                <Link className={styles.trayLink} href={item.href}>
                  <span className={styles.trayLabel}>{item.label}</span>
                  <span className={styles.trayArrow} aria-hidden="true">
                    <FiArrowRight size={14} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <button type="button" className={styles.trayGoUp} onClick={goUp}>
            <span className={styles.trayLabel}>Go up</span>
            <span className={styles.trayArrowUp} aria-hidden="true">
              <FiArrowUp size={14} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
