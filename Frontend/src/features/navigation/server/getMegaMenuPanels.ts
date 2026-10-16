import "server-only";

import {
  buildMegaMenuPanels,
  type MegaMenuPanel,
} from "@/features/navigation/model/megaMenuContent";
import { fetchPublishedServices } from "@/features/services/server/fetchPublishedServices";

export async function getMegaMenuPanels(): Promise<readonly MegaMenuPanel[]> {
  const services = await fetchPublishedServices();
  return buildMegaMenuPanels(
    services.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
    })),
  );
}
