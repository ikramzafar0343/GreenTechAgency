"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  findMegaMenuPanel,
  type MegaMenuPanel,
} from "@/features/navigation/model/megaMenuContent";
import type { MegaMenuId } from "@/features/navigation/model/navLinks";

const MegaMenuPanelsContext = createContext<readonly MegaMenuPanel[]>([]);

type MegaMenuPanelsProviderProps = {
  panels: readonly MegaMenuPanel[];
  children: ReactNode;
};

export function MegaMenuPanelsProvider({
  panels,
  children,
}: MegaMenuPanelsProviderProps) {
  return (
    <MegaMenuPanelsContext.Provider value={panels}>
      {children}
    </MegaMenuPanelsContext.Provider>
  );
}

export function useMegaMenuPanels(): readonly MegaMenuPanel[] {
  return useContext(MegaMenuPanelsContext);
}

export function useMegaMenuPanel(id: MegaMenuId): MegaMenuPanel | undefined {
  return findMegaMenuPanel(useMegaMenuPanels(), id);
}
