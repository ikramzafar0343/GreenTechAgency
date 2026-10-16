/**
 * Curated P1 hero overlays — used when machine providers are rate-limited.
 */
import { config as loadEnv } from "dotenv";
import { upsertPublishedTranslation } from "../content/translations.js";
import { getDb } from "../db/client.js";
import { siteDocument } from "../db/schema/siteContent.js";
import { closeAppPool } from "../db/pool.js";
import { eq } from "drizzle-orm";
import type { ContentLocale } from "../db/schema/translations.js";

loadEnv({ path: ".env.local" });
loadEnv();

const HERO: Record<
  Exclude<ContentLocale, "en">,
  {
    headline: string;
    before: string;
    emphasis: string;
    after: string;
    primary: string;
    secondary: string;
  }
> = {
  es: {
    headline: "Soluciones digitales que impulsan el crecimiento empresarial",
    before: "Creamos ",
    emphasis:
      "sitios web, software, aplicaciones móviles, SEO, marketing digital y soluciones de IA",
    after:
      " de alto rendimiento diseñados para aumentar la visibilidad, generar leads y hacer crecer su negocio.",
    primary: "Comience su proyecto",
    secondary: "Explore nuestros servicios",
  },
  ar: {
    headline: "حلول رقمية تدفع نمو الأعمال",
    before: "نبني ",
    emphasis:
      "مواقع ويب وبرمجيات وتطبيقات جوال وتحسين محركات البحث والتسويق الرقمي وحلول الذكاء الاصطناعي",
    after:
      " عالية الأداء مصممة لزيادة الظهور وتوليد العملاء المحتملين وتنمية أعمالك.",
    primary: "ابدأ مشروعك",
    secondary: "استكشف خدماتنا",
  },
  de: {
    headline: "Digitale Lösungen, die Geschäftswachstum antreiben",
    before: "Wir entwickeln leistungsstarke ",
    emphasis:
      "Websites, Software, Mobile Apps, SEO, digitales Marketing und KI-Lösungen",
    after:
      ", die Sichtbarkeit steigern, Leads generieren und Ihr Unternehmen wachsen lassen.",
    primary: "Projekt starten",
    secondary: "Unsere Services entdecken",
  },
  fr: {
    headline: "Des solutions numériques qui stimulent la croissance",
    before: "Nous créons des ",
    emphasis:
      "sites web, logiciels, applications mobiles, SEO, marketing digital et solutions d'IA",
    after:
      " haute performance conçus pour augmenter la visibilité, générer des leads et développer votre activité.",
    primary: "Démarrer votre projet",
    secondary: "Explorer nos services",
  },
  "fr-CA": {
    headline: "Des solutions numériques qui stimulent la croissance",
    before: "Nous créons des ",
    emphasis:
      "sites web, logiciels, applications mobiles, SEO, marketing numérique et solutions d'IA",
    after:
      " haute performance conçus pour accroître la visibilité, générer des prospects et faire croître votre entreprise.",
    primary: "Démarrer votre projet",
    secondary: "Explorer nos services",
  },
  it: {
    headline: "Soluzioni digitali che guidano la crescita aziendale",
    before: "Realizziamo ",
    emphasis:
      "siti web, software, app mobili, SEO, digital marketing e soluzioni di IA",
    after:
      " ad alte prestazioni progettati per aumentare la visibilità, generare lead e far crescere la tua attività.",
    primary: "Avvia il tuo progetto",
    secondary: "Esplora i nostri servizi",
  },
  "pt-BR": {
    headline: "Soluções digitais que impulsionam o crescimento dos negócios",
    before: "Criamos ",
    emphasis:
      "sites, software, aplicativos móveis, SEO, marketing digital e soluções de IA",
    after:
      " de alto desempenho para aumentar a visibilidade, gerar leads e fazer seu negócio crescer.",
    primary: "Comece seu projeto",
    secondary: "Explore nossos serviços",
  },
  nl: {
    headline: "Digitale oplossingen die bedrijfsgroei stimuleren",
    before: "Wij bouwen hoogwaardige ",
    emphasis:
      "websites, software, mobiele apps, SEO, digitale marketing en AI-oplossingen",
    after:
      " om zichtbaarheid te vergroten, leads te genereren en uw bedrijf te laten groeien.",
    primary: "Start uw project",
    secondary: "Ontdek onze diensten",
  },
  tr: {
    headline: "İş büyümesini hızlandıran dijital çözümler",
    before: "Görünürlüğü artırmak, potansiyel müşteri oluşturmak ve işinizi büyütmek için yüksek performanslı ",
    emphasis:
      "web siteleri, yazılım, mobil uygulamalar, SEO, dijital pazarlama ve yapay zeka çözümleri",
    after: " geliştiriyoruz.",
    primary: "Projenize başlayın",
    secondary: "Hizmetlerimizi keşfedin",
  },
  ur: {
    headline: "ڈیجیٹل حل جو کاروباری ترقی کو آگے بڑھاتے ہیں",
    before: "ہم اعلیٰ کارکردگی والے ",
    emphasis:
      "ویب سائٹس، سافٹ ویئر، موبائل ایپس، SEO، ڈیجیٹل مارکیٹنگ اور AI حل",
    after:
      " بناتے ہیں جو نمائش بڑھائیں، لیڈز پیدا کریں اور آپ کے کاروبار کو ترقی دیں۔",
    primary: "اپنا منصوبہ شروع کریں",
    secondary: "ہماری خدمات دیکھیں",
  },
  hi: {
    headline: "डिजिटल समाधान जो व्यापार वृद्धि को आगे बढ़ाते हैं",
    before: "हम उच्च-प्रदर्शन ",
    emphasis:
      "वेबसाइट, सॉफ्टवेयर, मोबाइल ऐप, SEO, डिजिटल मार्केटिंग और AI समाधान",
    after:
      " बनाते हैं जो दृश्यता बढ़ाएं, लीड जनरेट करें और आपके व्यवसाय को बढ़ाएं।",
    primary: "अपना प्रोजेक्ट शुरू करें",
    secondary: "हमारी सेवाएँ देखें",
  },
  "zh-CN": {
    headline: "推动业务增长的数字解决方案",
    before: "我们打造高性能的",
    emphasis: "网站、软件、移动应用、SEO、数字营销和人工智能解决方案",
    after: "，帮助提升曝光、获取线索并推动业务增长。",
    primary: "开始您的项目",
    secondary: "探索我们的服务",
  },
  ja: {
    headline: "ビジネス成長を加速するデジタルソリューション",
    before: "私たちは高性能な",
    emphasis:
      "ウェブサイト、ソフトウェア、モバイルアプリ、SEO、デジタルマーケティング、AIソリューション",
    after:
      "を構築し、認知度向上、リード獲得、事業成長を支援します。",
    primary: "プロジェクトを始める",
    secondary: "サービスを見る",
  },
  ko: {
    headline: "비즈니스 성장을 이끄는 디지털 솔루션",
    before: "우리는 가시성 향상, 리드 창출, 비즈니스 성장을 위해 고성능 ",
    emphasis:
      "웹사이트, 소프트웨어, 모바일 앱, SEO, 디지털 마케팅 및 AI 솔루션",
    after: "을 구축합니다.",
    primary: "프로젝트 시작하기",
    secondary: "서비스 살펴보기",
  },
  ru: {
    headline: "Цифровые решения, которые ускоряют рост бизнеса",
    before: "Мы создаём высокопроизводительные ",
    emphasis:
      "сайты, ПО, мобильные приложения, SEO, digital-маркетинг и ИИ-решения",
    after:
      ", чтобы повышать видимость, привлекать лиды и развивать ваш бизнес.",
    primary: "Начать проект",
    secondary: "Изучить услуги",
  },
  id: {
    headline: "Solusi digital yang mendorong pertumbuhan bisnis",
    before: "Kami membangun ",
    emphasis:
      "situs web, perangkat lunak, aplikasi seluler, SEO, pemasaran digital, dan solusi AI",
    after:
      " berkinerja tinggi untuk meningkatkan visibilitas, menghasilkan prospek, dan menumbuhkan bisnis Anda.",
    primary: "Mulai proyek Anda",
    secondary: "Jelajahi layanan kami",
  },
  vi: {
    headline: "Giải pháp số thúc đẩy tăng trưởng kinh doanh",
    before: "Chúng tôi xây dựng ",
    emphasis:
      "website, phần mềm, ứng dụng di động, SEO, marketing số và giải pháp AI",
    after:
      " hiệu suất cao để tăng khả năng hiển thị, tạo lead và phát triển doanh nghiệp của bạn.",
    primary: "Bắt đầu dự án",
    secondary: "Khám phá dịch vụ",
  },
};

async function main() {
  const db = getDb();
  const rows = await db
    .select()
    .from(siteDocument)
    .where(eq(siteDocument.key, "hero"))
    .limit(1);
  const base = rows[0]?.publishedDoc as Record<string, unknown> | undefined;
  if (!base) throw new Error("hero site document missing");

  for (const [locale, copy] of Object.entries(HERO)) {
    const doc = structuredClone(base) as {
      headline: string;
      paragraphs: Array<{
        id: string;
        before: string;
        emphasis: string;
        after: string;
      }>;
      primaryCta: { label: string; href: string };
      secondaryCta: { label: string; eventName?: string };
    };
    doc.headline = copy.headline;
    if (doc.paragraphs?.[0]) {
      doc.paragraphs[0].before = copy.before;
      doc.paragraphs[0].emphasis = copy.emphasis;
      doc.paragraphs[0].after = copy.after;
    }
    doc.primaryCta = { ...doc.primaryCta, label: copy.primary };
    doc.secondaryCta = { ...doc.secondaryCta, label: copy.secondary };
    await upsertPublishedTranslation({
      entityType: "site_document",
      entityId: "hero",
      locale: locale as ContentLocale,
      doc: doc as unknown as Record<string, unknown>,
    });
    console.log("ok hero", locale, copy.headline);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => closeAppPool());
