import { FaBehance } from "react-icons/fa";
import {
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
import type { FooterSocialLink } from "@/features/footer/model/types";
import styles from "@/features/footer/styles/footer.module.css";

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

type FooterSocialLinksProps = {
  links: FooterSocialLink[];
};

export function FooterSocialLinks({ links }: FooterSocialLinksProps) {
  if (links.length === 0) {
    return null;
  }

  const ordered = [...links].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <ul className={styles.socialList} aria-label="Social profiles">
      {ordered.map((link) => {
        const Icon = SOCIAL_ICONS[link.platform.toLowerCase()] ?? FiShare2;
        return (
          <li key={link.id}>
            <a
              href={link.url}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
            >
              <Icon aria-hidden="true" focusable="false" size={18} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
