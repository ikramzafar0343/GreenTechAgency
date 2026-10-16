"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { usePathname } from "next/navigation";
import {
  DESKTOP_MEGA_BREAKPOINT_PX,
  type MegaMenuId,
} from "@/features/navigation/model/navLinks";

const OPEN_DELAY_MS = 80;
const SWITCH_DELAY_MS = 60;
const CLOSE_DELAY_MS = 180;
const EXIT_MS = 200;

type TimerHandle = number | null;

function clearTimer(ref: { current: TimerHandle }) {
  if (ref.current !== null) {
    window.clearTimeout(ref.current);
    ref.current = null;
  }
}

function isFineHoverPointer(event?: ReactPointerEvent) {
  if (typeof window === "undefined") {
    return false;
  }
  if (event && event.pointerType === "touch") {
    return false;
  }
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    window.innerWidth >= DESKTOP_MEGA_BREAKPOINT_PX
  );
}

export function useMegaMenuController() {
  const pathname = usePathname();
  const [sessionPath, setSessionPath] = useState(pathname);
  const [activeMenuId, setActiveMenuId] = useState<MegaMenuId | null>(null);
  const [isPanelShown, setIsPanelShown] = useState(false);
  const [focusLocked, setFocusLocked] = useState(false);

  const openTimer = useRef<TimerHandle>(null);
  const switchTimer = useRef<TimerHandle>(null);
  const closeTimer = useRef<TimerHandle>(null);
  const exitTimer = useRef<TimerHandle>(null);
  const suppressUntilLeave = useRef(false);
  const regionRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<MegaMenuId | null>(null);
  const shownRef = useRef(false);

  if (pathname !== sessionPath) {
    setSessionPath(pathname);
    setIsPanelShown(false);
    setActiveMenuId(null);
    setFocusLocked(false);
  }

  const clearAllTimers = useCallback(() => {
    clearTimer(openTimer);
    clearTimer(switchTimer);
    clearTimer(closeTimer);
  }, []);

  const closeNow = useCallback(() => {
    clearAllTimers();
    setIsPanelShown(false);
    shownRef.current = false;
    clearTimer(exitTimer);
    exitTimer.current = window.setTimeout(() => {
      setActiveMenuId(null);
      activeRef.current = null;
      setFocusLocked(false);
      exitTimer.current = null;
    }, EXIT_MS);
  }, [clearAllTimers]);

  const openMenu = useCallback(
    (id: MegaMenuId, immediate = false) => {
      clearAllTimers();
      clearTimer(exitTimer);
      suppressUntilLeave.current = false;

      const apply = () => {
        activeRef.current = id;
        shownRef.current = true;
        setActiveMenuId(id);
        setIsPanelShown(true);
      };

      if (immediate || activeRef.current === id) {
        apply();
        return;
      }

      if (activeRef.current && activeRef.current !== id) {
        switchTimer.current = window.setTimeout(apply, SWITCH_DELAY_MS);
        return;
      }

      openTimer.current = window.setTimeout(apply, OPEN_DELAY_MS);
    },
    [clearAllTimers],
  );

  const scheduleClose = useCallback(() => {
    if (focusLocked) {
      return;
    }
    clearTimer(openTimer);
    clearTimer(switchTimer);
    clearTimer(closeTimer);
    closeTimer.current = window.setTimeout(() => {
      closeNow();
    }, CLOSE_DELAY_MS);
  }, [closeNow, focusLocked]);

  const cancelClose = useCallback(() => {
    clearTimer(closeTimer);
  }, []);

  const handleTriggerEnter = useCallback(
    (id: MegaMenuId, event?: ReactPointerEvent) => {
      if (!isFineHoverPointer(event)) {
        return;
      }
      if (suppressUntilLeave.current && activeRef.current === id) {
        return;
      }
      cancelClose();
      openMenu(id);
    },
    [cancelClose, openMenu],
  );

  const handleTriggerLeave = useCallback(
    (event: ReactPointerEvent) => {
      if (!isFineHoverPointer(event)) {
        return;
      }
      const next = event.relatedTarget as Node | null;
      if (next && regionRef.current?.contains(next)) {
        return;
      }
      scheduleClose();
    },
    [scheduleClose],
  );

  const handleRegionEnter = useCallback(() => {
    cancelClose();
  }, [cancelClose]);

  const handleRegionLeave = useCallback(
    (event: ReactPointerEvent) => {
      if (!isFineHoverPointer(event)) {
        return;
      }
      const next = event.relatedTarget as Node | null;
      if (next && regionRef.current?.contains(next)) {
        return;
      }
      suppressUntilLeave.current = false;
      scheduleClose();
    },
    [scheduleClose],
  );

  const toggleMenu = useCallback(
    (id: MegaMenuId) => {
      clearAllTimers();
      if (activeRef.current === id && shownRef.current) {
        suppressUntilLeave.current = true;
        closeNow();
        return;
      }
      suppressUntilLeave.current = false;
      activeRef.current = id;
      shownRef.current = true;
      setActiveMenuId(id);
      setIsPanelShown(true);
    },
    [clearAllTimers, closeNow],
  );

  const handleEscape = useCallback(() => {
    if (!activeRef.current) {
      return false;
    }
    suppressUntilLeave.current = true;
    closeNow();
    return true;
  }, [closeNow]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < DESKTOP_MEGA_BREAKPOINT_PX) {
        closeNow();
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [closeNow]);

  useEffect(() => {
    return () => {
      clearAllTimers();
      clearTimer(exitTimer);
    };
  }, [clearAllTimers]);

  return {
    activeMenuId,
    isOpen: activeMenuId !== null && isPanelShown,
    isPanelShown,
    regionRef,
    setFocusLocked,
    handleTriggerEnter,
    handleTriggerLeave,
    handleRegionEnter,
    handleRegionLeave,
    toggleMenu,
    openMenu,
    closeNow,
    handleEscape,
  };
}
