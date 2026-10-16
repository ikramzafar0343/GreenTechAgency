import { Header } from "@/features/header/components/Header";
import { MegaMenuPanelsProvider } from "@/features/navigation/context/MegaMenuPanelsContext";
import { buildMegaMenuPanels } from "@/features/navigation/model/megaMenuContent";
import { getMegaMenuPanels } from "@/features/navigation/server/getMegaMenuPanels";

export async function SiteHeader() {
  let panels;
  try {
    panels = await getMegaMenuPanels();
  } catch {
    panels = buildMegaMenuPanels([]);
  }
  return (
    <MegaMenuPanelsProvider panels={panels}>
      <Header />
    </MegaMenuPanelsProvider>
  );
}
