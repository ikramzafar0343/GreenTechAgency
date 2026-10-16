/**
 * Curated FAQ question/answer overlays for P1 locales.
 */
import { config as loadEnv } from "dotenv";
import { eq } from "drizzle-orm";
import {
  getPublishedTranslationDoc,
  mergeLocalizedDoc,
  upsertPublishedTranslation,
} from "../content/translations.js";
import { getDb } from "../db/client.js";
import { faqItem } from "../db/schema/siteContent.js";
import { closeAppPool } from "../db/pool.js";
import type { ContentLocale } from "../db/schema/translations.js";

loadEnv({ path: ".env.local" });
loadEnv();

type FaqCopy = { question: string; answer: string };

const FAQ: Record<string, Record<"es" | "ar" | "de" | "fr" | "fr-CA", FaqCopy>> =
  {
    "faq-services": {
      es: {
        question: "¿Qué servicios digitales ofrecéis?",
        answer:
          "Ofrecemos diseño, ingeniería y crecimiento: sitios web, software, aplicaciones, SEO, marketing digital, branding y soluciones de IA adaptadas a sus objetivos.",
      },
      ar: {
        question: "ما الخدمات الرقمية التي تقدمونها؟",
        answer:
          "نقدم التصميم والهندسة والنمو: مواقع وبرمجيات وتطبيقات وتحسين محركات البحث وتسويق رقمي وهوية وحلول ذكاء اصطناعي وفق أهدافكم.",
      },
      de: {
        question: "Welche digitalen Leistungen bietet ihr an?",
        answer:
          "Wir bieten Design, Engineering und Growth: Websites, Software, Apps, SEO, digitales Marketing, Branding und KI-Lösungen passend zu Ihren Zielen.",
      },
      fr: {
        question: "Quels services numériques proposez-vous ?",
        answer:
          "Nous proposons design, ingénierie et croissance : sites, logiciels, applications, SEO, marketing digital, branding et solutions d’IA alignés sur vos objectifs.",
      },
      "fr-CA": {
        question: "Quels services numériques offrez-vous ?",
        answer:
          "Nous offrons design, ingénierie et croissance : sites, logiciels, applications, SEO, marketing numérique, image de marque et solutions d’IA selon vos objectifs.",
      },
    },
  };

async function main() {
  const db = getDb();
  const rows = await db
    .select()
    .from(faqItem)
    .where(eq(faqItem.status, "published"));

  // Translate all FAQs by deep-copying English and applying known overrides;
  // for IDs without curated copy, leave existing overlay (may still be English).
  for (const row of rows) {
    const curated = FAQ[row.id];
    if (!curated) {
      console.log("skip curated (no map)", row.id);
      continue;
    }
    for (const locale of Object.keys(curated) as Array<keyof typeof curated>) {
      const existing =
        (await getPublishedTranslationDoc("faq_item", row.id, locale)) ?? {};
      const merged = mergeLocalizedDoc(
        existing,
        curated[locale] as unknown as Record<string, unknown>,
      );
      await upsertPublishedTranslation({
        entityType: "faq_item",
        entityId: row.id,
        locale: locale as ContentLocale,
        doc: merged,
      });
      console.log("ok", row.id, locale, curated[locale].question);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => closeAppPool());
