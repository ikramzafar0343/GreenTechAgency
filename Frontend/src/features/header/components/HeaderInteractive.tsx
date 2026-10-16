"use client";

import { useCallback, useEffect, useState } from "react";
import { DesktopNavigation } from "@/features/header/components/DesktopNavigation";
import { HeaderActions } from "@/features/header/components/HeaderActions";
import { HeaderBrand } from "@/features/header/components/HeaderBrand";
import { MegaMenuPanel } from "@/features/header/components/MegaMenuPanel";
import { MobileNavigation } from "@/features/header/components/MobileNavigation";
import { useHeaderInkMode } from "@/features/header/hooks/useHeaderInkMode";
import { useHeaderScrollState } from "@/features/header/hooks/useHeaderScrollState";
import { useMegaMenuController } from "@/features/header/hooks/useMegaMenuController";
import { OPEN_SERVICES_EVENT } from "@/features/hero/model/heroContent";
import { useRouter } from "@/i18n/navigation";
import shellStyles from "@/features/header/styles/headerShell.module.css";

export function HeaderInteractive() {
  const router = useRouter();
  const { isScrolled, enableTransition } = useHeaderScrollState();
  const inkMode = useHeaderInkMode(isScrolled);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [headerElement, setHeaderElement] = useState<HTMLElement | null>(null);
  const mega = useMegaMenuController();

  const { openMenu, closeNow } = mega;

  useEffect(() => {
    const handleOpenServices = () => {
      setIsMobileOpen(false);
      openMenu("services", true);
    };

    window.addEventListener(OPEN_SERVICES_EVENT, handleOpenServices);
    return () => {
      window.removeEventListener(OPEN_SERVICES_EVENT, handleOpenServices);
    };
  }, [openMenu]);

  const handleMobileToggle = useCallback(() => {
    closeNow();
    setIsMobileOpen((open) => !open);
  }, [closeNow]);

  const handleMobileClose = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const handleContactClick = useCallback(() => {
    closeNow();
    setIsMobileOpen(false);
    router.push("/contact");
  }, [closeNow, router]);

  const shellClassName = [
    shellStyles.shell,
    enableTransition ? shellStyles.shellTransition : "",
    isScrolled ? shellStyles.shellScrolled : "",
  ]
    .filter(Boolean)
    .join(" ");

  const blurClassName = [
    shellStyles.blurSurface,
    enableTransition ? shellStyles.blurTransition : "",
  ]
    .filter(Boolean)
    .join(" ");

  const glassClassName = [
    shellStyles.mobileGlass,
    enableTransition ? shellStyles.mobileGlassTransition : "",
    isScrolled ? shellStyles.mobileGlassVisible : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shellStyles.scope} data-header-ink={inkMode}>
      <header
        ref={setHeaderElement}
        className={shellStyles.header}
        data-site-header
      >
        <div className={shellStyles.container}>
          <div className={glassClassName} aria-hidden="true" />
          <div className={shellClassName}>
            <div className={blurClassName} aria-hidden="true" />
            <HeaderBrand />
            <DesktopNavigation mega={mega} />
            <HeaderActions
              onContactClick={handleContactClick}
              isMenuOpen={isMobileOpen}
              onMenuToggle={handleMobileToggle}
            />
          </div>
        </div>
      </header>

      <MegaMenuPanel
        activeMenuId={mega.activeMenuId}
        isShown={mega.isPanelShown}
        headerElement={headerElement}
        onClose={mega.closeNow}
        onNavigate={mega.closeNow}
        onFocusInside={() => mega.setFocusLocked(true)}
        onFocusOutside={() => {
          mega.setFocusLocked(false);
          mega.closeNow();
        }}
        onPointerEnter={mega.handleRegionEnter}
        onPointerLeave={mega.handleRegionLeave}
      />

      <MobileNavigation
        isOpen={isMobileOpen}
        onClose={handleMobileClose}
      />
    </div>
  );
}
