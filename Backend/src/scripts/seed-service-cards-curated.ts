/**
 * Curated P1 service card translations (title/label/shortDescription).
 * Merges into existing content_translation overlays.
 */
import { config as loadEnv } from "dotenv";
import { eq } from "drizzle-orm";
import {
  getPublishedTranslationDoc,
  mergeLocalizedDoc,
  upsertPublishedTranslation,
} from "../content/translations.js";
import { getDb } from "../db/client.js";
import { service } from "../db/schema/services.js";
import { closeAppPool } from "../db/pool.js";
import type { ContentLocale } from "../db/schema/translations.js";

loadEnv({ path: ".env.local" });
loadEnv();

type Card = { title: string; label: string; shortDescription: string };

const CARDS: Record<string, Record<"es" | "ar" | "de" | "fr" | "fr-CA", Card>> =
  {
    "web-development": {
      es: {
        title: "Desarrollo web",
        label: "PARA SITIOS RÁPIDOS Y ESCALABLES",
        shortDescription:
          "Sitios web de alto rendimiento creados para velocidad, escalabilidad y conversión.",
      },
      ar: {
        title: "تطوير الويب",
        label: "لمواقع سريعة وقابلة للتوسع",
        shortDescription:
          "مواقع عالية الأداء مبنية للسرعة وقابلية التوسع والتحويل.",
      },
      de: {
        title: "Webentwicklung",
        label: "FÜR SCHNELLE, SKALIERBARE WEBSITES",
        shortDescription:
          "Hochleistungs-Websites für Geschwindigkeit, Skalierbarkeit und Conversion.",
      },
      fr: {
        title: "Développement web",
        label: "POUR DES SITES RAPIDES ET ÉVOLUTIFS",
        shortDescription:
          "Sites web haute performance conçus pour la vitesse, l’évolutivité et la conversion.",
      },
      "fr-CA": {
        title: "Développement web",
        label: "POUR DES SITES RAPIDES ET ÉVOLUTIFS",
        shortDescription:
          "Sites web haute performance conçus pour la vitesse, l’évolutivité et la conversion.",
      },
    },
    "mobile-app-development": {
      es: {
        title: "Desarrollo de aplicaciones móviles",
        label: "PARA EXPERIENCIAS MÓVILES CONECTADAS",
        shortDescription:
          "Apps nativas y multiplataforma que mantienen a los clientes comprometidos en cada dispositivo.",
      },
      ar: {
        title: "تطوير تطبيقات الجوال",
        label: "لتجارب جوال متصلة",
        shortDescription:
          "تطبيقات أصلية ومتعددة المنصات تبقي العملاء متفاعلين على كل جهاز.",
      },
      de: {
        title: "Mobile-App-Entwicklung",
        label: "FÜR VERBUNDENE MOBILE ERLEBNISSE",
        shortDescription:
          "Native und Cross-Platform-Apps, die Kunden auf jedem Gerät binden.",
      },
      fr: {
        title: "Développement d’applications mobiles",
        label: "POUR DES EXPÉRIENCES MOBILES CONNECTÉES",
        shortDescription:
          "Applications natives et multiplateformes qui engagent les clients sur chaque appareil.",
      },
      "fr-CA": {
        title: "Développement d’applications mobiles",
        label: "POUR DES EXPÉRIENCES MOBILES CONNECTÉES",
        shortDescription:
          "Applications natives et multiplateformes qui engagent les clients sur chaque appareil.",
      },
    },
    "ecommerce-development": {
      es: {
        title: "Desarrollo de comercio electrónico",
        label: "PARA TIENDAS ONLINE DE ALTA CONVERSIÓN",
        shortDescription:
          "Experiencias de ecommerce diseñadas para vender, escalar y fidelizar compradores.",
      },
      ar: {
        title: "تطوير التجارة الإلكترونية",
        label: "لمتاجر إلكترونية عالية التحويل",
        shortDescription:
          "تجارب تجارة إلكترونية مصممة للبيع والتوسع والاحتفاظ بالمتسوقين.",
      },
      de: {
        title: "E-Commerce-Entwicklung",
        label: "FÜR HOCHKONVERTIERENDE ONLINE-SHOPS",
        shortDescription:
          "Ecommerce-Erlebnisse zum Verkaufen, Skalieren und Binden von Käufern.",
      },
      fr: {
        title: "Développement e-commerce",
        label: "POUR DES BOUTIQUES EN LIGNE À FORTE CONVERSION",
        shortDescription:
          "Expériences e-commerce conçues pour vendre, évoluer et fidéliser.",
      },
      "fr-CA": {
        title: "Développement commerce électronique",
        label: "POUR DES BOUTIQUES EN LIGNE À FORTE CONVERSION",
        shortDescription:
          "Expériences de commerce électronique conçues pour vendre, évoluer et fidéliser.",
      },
    },
    "ui-ux-design": {
      es: {
        title: "Diseño UI/UX",
        label: "PARA EXPERIENCIAS DIGITALES INTUITIVAS",
        shortDescription:
          "Interfaces claras y recorridos de usuario que hacen que lo complejo se sienta simple.",
      },
      ar: {
        title: "تصميم واجهة وتجربة المستخدم",
        label: "لتجارب رقمية بديهية",
        shortDescription:
          "واجهات واضحة ومسارات مستخدم تجعل المنتجات المعقدة تبدو بسيطة.",
      },
      de: {
        title: "UI/UX-Design",
        label: "FÜR INTUITIVE DIGITALE ERLEBNISSE",
        shortDescription:
          "Klare Interfaces und Nutzerreisen, die komplexe Produkte einfach machen.",
      },
      fr: {
        title: "Design UI/UX",
        label: "POUR DES EXPÉRIENCES NUMÉRIQUES INTUITIVES",
        shortDescription:
          "Interfaces claires et parcours utilisateurs qui simplifient les produits complexes.",
      },
      "fr-CA": {
        title: "Design UI/UX",
        label: "POUR DES EXPÉRIENCES NUMÉRIQUES INTUITIVES",
        shortDescription:
          "Interfaces claires et parcours utilisateurs qui simplifient les produits complexes.",
      },
    },
    "content-marketing": {
      es: {
        title: "Marketing de contenidos",
        label: "PARA CONTENIDO QUE CONSTRUYE AUDIENCIA",
        shortDescription:
          "Sistemas de contenido estratégicos que atraen, educan y convierten compradores.",
      },
      ar: {
        title: "تسويق المحتوى",
        label: "لمحتوى يبني الجمهور",
        shortDescription:
          "أنظمة محتوى استراتيجية تجذب المشترين وتثقفهم وتحولهم.",
      },
      de: {
        title: "Content-Marketing",
        label: "FÜR CONTENT, DER AUDIENCE AUFBAUT",
        shortDescription:
          "Strategische Content-Systeme, die Käufer anziehen, informieren und konvertieren.",
      },
      fr: {
        title: "Marketing de contenu",
        label: "POUR UN CONTENU QUI CONSTRUIT L’AUDIENCE",
        shortDescription:
          "Systèmes de contenu stratégiques qui attirent, éduquent et convertissent.",
      },
      "fr-CA": {
        title: "Marketing de contenu",
        label: "POUR UN CONTENU QUI CONSTRUIT L’AUDIENCE",
        shortDescription:
          "Systèmes de contenu stratégiques qui attirent, éduquent et convertissent.",
      },
    },
    copywriting: {
      es: {
        title: "Redacción publicitaria",
        label: "PARA PALABRAS QUE CONVIERTEN",
        shortDescription:
          "Mensajes persuasivos para sitios web, campañas y storytelling de producto.",
      },
      ar: {
        title: "كتابة الإعلانات",
        label: "لكلمات تحوّل",
        shortDescription:
          "رسائل مقنعة للمواقع والحملات وسرد قصة المنتج.",
      },
      de: {
        title: "Copywriting",
        label: "FÜR WORTE, DIE KONVERTIEREN",
        shortDescription:
          "Überzeugende Botschaften für Websites, Kampagnen und Produkt-Storytelling.",
      },
      fr: {
        title: "Rédaction publicitaire",
        label: "POUR DES MOTS QUI CONVERTISSENT",
        shortDescription:
          "Messages persuasifs pour sites, campagnes et storytelling produit.",
      },
      "fr-CA": {
        title: "Rédaction publicitaire",
        label: "POUR DES MOTS QUI CONVERTISSENT",
        shortDescription:
          "Messages persuasifs pour sites, campagnes et storytelling de produit.",
      },
    },
    "digital-marketing": {
      es: {
        title: "Marketing digital",
        label: "PARA TRÁFICO, LEADS Y CONVERSIONES",
        shortDescription:
          "Programas de pago y orgánicos que aumentan la visibilidad y la demanda cualificada.",
      },
      ar: {
        title: "التسويق الرقمي",
        label: "للزيارات والعملاء المحتملين والتحويلات",
        shortDescription:
          "برامج مدفوعة وعضوية تنمي الظهور والطلب المؤهل.",
      },
      de: {
        title: "Digitales Marketing",
        label: "FÜR TRAFFIC, LEADS & CONVERSIONS",
        shortDescription:
          "Paid- und Organic-Programme, die Sichtbarkeit und qualifizierte Nachfrage steigern.",
      },
      fr: {
        title: "Marketing digital",
        label: "POUR LE TRAFIC, LES LEADS ET LES CONVERSIONS",
        shortDescription:
          "Programmes payants et organiques qui développent visibilité et demande qualifiée.",
      },
      "fr-CA": {
        title: "Marketing numérique",
        label: "POUR LE TRAFIC, LES PROSPECTS ET LES CONVERSIONS",
        shortDescription:
          "Programmes payants et organiques qui développent la visibilité et la demande qualifiée.",
      },
    },
    "social-media-marketing": {
      es: {
        title: "Marketing en redes sociales",
        label: "PARA AUDIENCIAS SOCIALES COMPROMETIDAS",
        shortDescription:
          "Estrategia de canales y creatividad que convierte la atención en crecimiento comunitario.",
      },
      ar: {
        title: "التسويق عبر وسائل التواصل",
        label: "لجماهير اجتماعية متفاعلة",
        shortDescription:
          "استراتيجية قنوات وإبداع يحوّل الانتباه إلى نمو مجتمعي.",
      },
      de: {
        title: "Social-Media-Marketing",
        label: "FÜR ENGAGIERTE SOCIAL AUDIENCES",
        shortDescription:
          "Kanalstrategie und Kreativität, die Aufmerksamkeit in Community-Wachstum verwandeln.",
      },
      fr: {
        title: "Marketing des réseaux sociaux",
        label: "POUR DES AUDIENCES SOCIALES ENGAGÉES",
        shortDescription:
          "Stratégie de canaux et créativité qui transforment l’attention en croissance communautaire.",
      },
      "fr-CA": {
        title: "Marketing des médias sociaux",
        label: "POUR DES AUDIENCES SOCIALES ENGAGÉES",
        shortDescription:
          "Stratégie de canaux et créativité qui transforment l’attention en croissance communautaire.",
      },
    },
    "search-engine-optimization": {
      es: {
        title: "Optimización para motores de búsqueda",
        label: "PARA UNA MAYOR VISIBILIDAD EN BÚSQUEDA",
        shortDescription:
          "SEO técnico y de contenido que mejora posiciones y adquisición orgánica.",
      },
      ar: {
        title: "تحسين محركات البحث",
        label: "لظهور أقوى في البحث",
        shortDescription:
          "SEO تقني ومحتوى يحسّن الترتيب والاكتساب العضوي.",
      },
      de: {
        title: "Suchmaschinenoptimierung",
        label: "FÜR STÄRKERE SUCHSICHTBARKEIT",
        shortDescription:
          "Technisches und Content-SEO für bessere Rankings und organische Gewinnung.",
      },
      fr: {
        title: "Optimisation pour les moteurs de recherche",
        label: "POUR UNE MEILLEURE VISIBILITÉ DE RECHERCHE",
        shortDescription:
          "SEO technique et éditorial qui améliore les classements et l’acquisition organique.",
      },
      "fr-CA": {
        title: "Optimisation pour les moteurs de recherche",
        label: "POUR UNE MEILLEURE VISIBILITÉ DE RECHERCHE",
        shortDescription:
          "SEO technique et éditorial qui améliore les classements et l’acquisition organique.",
      },
    },
    "generative-engine-optimization": {
      es: {
        title: "Optimización para motores generativos",
        label: "PARA VISIBILIDAD EN BÚSQUEDA CON IA",
        shortDescription:
          "Optimización para motores generativos para que su marca aparezca en respuestas de IA.",
      },
      ar: {
        title: "تحسين محركات التوليد",
        label: "للظهور في بحث الذكاء الاصطناعي",
        shortDescription:
          "تحسين لمحركات التوليد حتى تظهر علامتك في إجابات الذكاء الاصطناعي.",
      },
      de: {
        title: "Generative Engine Optimization",
        label: "FÜR SICHTBARKEIT IN KI-SUCHE",
        shortDescription:
          "Optimierung für generative Engines, damit Ihre Marke in KI-Antworten erscheint.",
      },
      fr: {
        title: "Optimisation pour moteurs génératifs",
        label: "POUR LA VISIBILITÉ DANS LA RECHERCHE IA",
        shortDescription:
          "Optimisation pour les moteurs génératifs afin que votre marque apparaisse dans les réponses IA.",
      },
      "fr-CA": {
        title: "Optimisation pour moteurs génératifs",
        label: "POUR LA VISIBILITÉ DANS LA RECHERCHE IA",
        shortDescription:
          "Optimisation pour les moteurs génératifs afin que votre marque apparaisse dans les réponses IA.",
      },
    },
    "artificial-intelligence": {
      es: {
        title: "Inteligencia artificial",
        label: "PARA AUTOMATIZACIÓN EMPRESARIAL INTELIGENTE",
        shortDescription:
          "Sistemas de IA que automatizan flujos, insights y experiencias de cliente.",
      },
      ar: {
        title: "الذكاء الاصطناعي",
        label: "لأتمتة أعمال ذكية",
        shortDescription:
          "أنظمة ذكاء اصطناعي تؤتمت سير العمل والرؤى وتجارب العملاء.",
      },
      de: {
        title: "Künstliche Intelligenz",
        label: "FÜR INTELLIGENTE BUSINESS-AUTOMATISIERUNG",
        shortDescription:
          "KI-Systeme, die Workflows, Insights und Kundenerlebnisse automatisieren.",
      },
      fr: {
        title: "Intelligence artificielle",
        label: "POUR L’AUTOMATISATION INTELLIGENTE DES MÉTIERS",
        shortDescription:
          "Systèmes d’IA qui automatisent workflows, insights et expériences client.",
      },
      "fr-CA": {
        title: "Intelligence artificielle",
        label: "POUR L’AUTOMATISATION INTELLIGENTE DES AFFAIRES",
        shortDescription:
          "Systèmes d’IA qui automatisent les flux, les insights et les expériences client.",
      },
    },
    "augmented-reality": {
      es: {
        title: "Realidad aumentada",
        label: "PARA EXPERIENCIAS DE PRODUCTO INTERACTIVAS",
        shortDescription:
          "Experiencias AR que ayudan a los clientes a explorar productos en contexto real.",
      },
      ar: {
        title: "الواقع المعزز",
        label: "لتجارب منتجات تفاعلية",
        shortDescription:
          "تجارب واقع معزز تساعد العملاء على استكشاف المنتجات في سياق حقيقي.",
      },
      de: {
        title: "Augmented Reality",
        label: "FÜR INTERAKTIVE PRODUKTERLEBNISSE",
        shortDescription:
          "AR-Erlebnisse, mit denen Kunden Produkte im realen Kontext erkunden.",
      },
      fr: {
        title: "Réalité augmentée",
        label: "POUR DES EXPÉRIENCES PRODUIT INTERACTIVES",
        shortDescription:
          "Expériences AR qui aident les clients à explorer les produits en contexte réel.",
      },
      "fr-CA": {
        title: "Réalité augmentée",
        label: "POUR DES EXPÉRIENCES PRODUIT INTERACTIVES",
        shortDescription:
          "Expériences AR qui aident les clients à explorer les produits en contexte réel.",
      },
    },
    "virtual-reality": {
      es: {
        title: "Realidad virtual",
        label: "PARA EXPERIENCIAS DE MARCA INMERSIVAS",
        shortDescription:
          "Entornos VR inmersivos para formación, storytelling y engagement.",
      },
      ar: {
        title: "الواقع الافتراضي",
        label: "لتجارب علامة غامرة",
        shortDescription:
          "بيئات واقع افتراضي غامرة للتدريب والسرد والتفاعل.",
      },
      de: {
        title: "Virtual Reality",
        label: "FÜR IMMERSIVE MARKENERLEBNISSE",
        shortDescription:
          "Immersive VR-Umgebungen für Training, Storytelling und Engagement.",
      },
      fr: {
        title: "Réalité virtuelle",
        label: "POUR DES EXPÉRIENCES DE MARQUE IMMERSIVES",
        shortDescription:
          "Environnements VR immersifs pour la formation, le storytelling et l’engagement.",
      },
      "fr-CA": {
        title: "Réalité virtuelle",
        label: "POUR DES EXPÉRIENCES DE MARQUE IMMERSIVES",
        shortDescription:
          "Environnements VR immersifs pour la formation, le storytelling et l’engagement.",
      },
    },
    "digital-branding-creatives": {
      es: {
        title: "Branding digital y creatividades",
        label: "PARA UNA IDENTIDAD DE MARCA DISTINTIVA",
        shortDescription:
          "Sistemas de marca y activos creativos que hacen inconfundible su negocio.",
      },
      ar: {
        title: "العلامة الرقمية والإبداعات",
        label: "لهوية علامة مميزة",
        shortDescription:
          "أنظمة علامة وأصول إبداعية تجعل عملك غير قابل للخلط.",
      },
      de: {
        title: "Digitales Branding & Creatives",
        label: "FÜR EINE UNVERWECHSELBARE MARKENIDENTITÄT",
        shortDescription:
          "Markensysteme und Creative Assets, die Ihr Business unverwechselbar machen.",
      },
      fr: {
        title: "Branding digital et créatifs",
        label: "POUR UNE IDENTITÉ DE MARQUE DISTINCTIVE",
        shortDescription:
          "Systèmes de marque et actifs créatifs qui rendent votre entreprise incontournable.",
      },
      "fr-CA": {
        title: "Image de marque numérique et créatifs",
        label: "POUR UNE IDENTITÉ DE MARQUE DISTINCTIVE",
        shortDescription:
          "Systèmes de marque et actifs créatifs qui rendent votre entreprise incontournable.",
      },
    },
    "it-resource-outsourcing": {
      es: {
        title: "Externalización de recursos IT",
        label: "PARA TALENTO TECNOLÓGICO FLEXIBLE",
        shortDescription:
          "Especialistas de ingeniería y digital dedicados que amplían su equipo.",
      },
      ar: {
        title: "استعانة بموارد تقنية المعلومات",
        label: "لمواهب تقنية مرنة",
        shortDescription:
          "مهندسون ومتخصصون رقميون مخصصون يوسّعون فريقك.",
      },
      de: {
        title: "IT-Ressourcen-Outsourcing",
        label: "FÜR FLEXIBLES TECH-TALENT",
        shortDescription:
          "Dedizierte Engineering- und Digital-Spezialisten, die Ihr Team erweitern.",
      },
      fr: {
        title: "Externalisation de ressources IT",
        label: "POUR UN TALENT TECH FLEXIBLE",
        shortDescription:
          "Spécialistes engineering et digital dédiés qui renforcent votre équipe.",
      },
      "fr-CA": {
        title: "Externalisation de ressources TI",
        label: "POUR UN TALENT TECHNOLOGIQUE FLEXIBLE",
        shortDescription:
          "Spécialistes en ingénierie et numérique dédiés qui renforcent votre équipe.",
      },
    },
    "video-animation-2d-3d": {
      es: {
        title: "Animación de vídeo 2D/3D",
        label: "PARA MOTION QUE CAPTIVA",
        shortDescription:
          "Motion design y animación que explican productos y elevan campañas.",
      },
      ar: {
        title: "رسوم متحركة فيديو ثنائية/ثلاثية الأبعاد",
        label: "لحركة تأسر الانتباه",
        shortDescription:
          "تصميم حركة ورسوم متحركة تشرح المنتجات وترفع الحملات.",
      },
      de: {
        title: "2D/3D-Videoanimation",
        label: "FÜR MOTION, DIE FESSELT",
        shortDescription:
          "Motion Design und Animation, die Produkte erklären und Kampagnen stärken.",
      },
      fr: {
        title: "Animation vidéo 2D/3D",
        label: "POUR UN MOTION QUI CAPTIVE",
        shortDescription:
          "Motion design et animation qui expliquent les produits et élèvent les campagnes.",
      },
      "fr-CA": {
        title: "Animation vidéo 2D/3D",
        label: "POUR UN MOTION QUI CAPTIVE",
        shortDescription:
          "Motion design et animation qui expliquent les produits et élèvent les campagnes.",
      },
    },
  };

async function main() {
  const db = getDb();
  const rows = await db
    .select()
    .from(service)
    .where(eq(service.status, "published"));

  for (const row of rows) {
    const slug = row.publishedSlug ?? row.id;
    const cards = CARDS[slug];
    if (!cards) {
      console.warn("no curated cards for", slug);
      continue;
    }
    for (const locale of Object.keys(cards) as Array<keyof typeof cards>) {
      const existing =
        (await getPublishedTranslationDoc("service", row.id, locale)) ?? {};
      const merged = mergeLocalizedDoc(existing, cards[locale] as unknown as Record<
        string,
        unknown
      >);
      await upsertPublishedTranslation({
        entityType: "service",
        entityId: row.id,
        locale: locale as ContentLocale,
        doc: merged,
      });
      console.log("ok", slug, locale, cards[locale].title);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => closeAppPool());
