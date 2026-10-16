import { PublicFetchErrorPanel } from "@/components/site/PublicFetchErrorPanel";
import { ImpactMadeVisibleSection } from "@/features/impact";
import type { ImpactMadeVisibleContent } from "@/features/impact/model/impactTypes";
import { getPublicImpact } from "@/features/impact/server/getPublicImpact";
import { ServiceDetailEditorialHero } from "@/features/services/components/ServiceDetailEditorialHero";
import { ServiceDetailLeadPhoto } from "@/features/services/components/ServiceDetailLeadPhoto";
import { ServiceDetailPhotoPair } from "@/features/services/components/ServiceDetailPhotoPair";
import { ServiceDetailPrinciples } from "@/features/services/components/ServiceDetailPrinciples";
import { ServiceDetailRelatedStrip } from "@/features/services/components/ServiceDetailRelatedStrip";
import { ServiceDetailReveal } from "@/features/services/components/ServiceDetailReveal";
import { ServiceDetailStory } from "@/features/services/components/ServiceDetailStory";
import type { PublicServiceDetail } from "@/features/services/model/serviceDetailTypes";
import styles from "@/features/services/styles/serviceDetailEditorial.module.css";

type ServiceDetailPageProps = {
  detail: PublicServiceDetail;
};

function withServiceDeliveryRail(
  content: ImpactMadeVisibleContent,
  detail: PublicServiceDetail,
): ImpactMadeVisibleContent {
  const rail = detail.deliveryRail;
  return {
    ...content,
    cards: content.cards.map((card) => {
      if (card.kind !== "image") {
        return card;
      }
      return {
        ...card,
        image: {
          ...card.image,
          src: rail.src,
          alt: rail.alt || card.image.alt,
          tileTitle: rail.tileTitle || card.image.tileTitle || "Delivery",
          tileCaption:
            rail.tileCaption || card.image.tileCaption || "EDITORIAL DEMO",
        },
      };
    }),
  };
}

export async function ServiceDetailPage({ detail }: ServiceDetailPageProps) {
  const impact = await getPublicImpact();

  return (
    <ServiceDetailReveal className={styles.page ?? ""}>
      <ServiceDetailEditorialHero detail={detail} />
      <ServiceDetailLeadPhoto image={detail.leadImage} />
      <ServiceDetailStory detail={detail} />
      <ServiceDetailPhotoPair pair={detail.pairA} variant="a" />
      <ServiceDetailPrinciples principles={detail.principles} />
      <ServiceDetailPhotoPair pair={detail.pairB} variant="b" />
      <ServiceDetailRelatedStrip detail={detail} />
      {impact.ok ? (
        <ImpactMadeVisibleSection
          content={withServiceDeliveryRail(impact.data, detail)}
        />
      ) : "notPublished" in impact ? null : (
        <PublicFetchErrorPanel
          title="Impact section unavailable"
          message={impact.error.message}
        />
      )}
    </ServiceDetailReveal>
  );
}
