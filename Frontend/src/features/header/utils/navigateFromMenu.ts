import type { MouseEvent } from "react";

type MenuRouter = {
  push: (href: string) => void;
};

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
}

/** Navigate first, then close the menu so the link is not unmounted mid-click. */
export function navigateFromMenu(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  router: MenuRouter,
  onClose: () => void,
): void {
  if (isModifiedClick(event)) {
    onClose();
    return;
  }

  event.preventDefault();
  router.push(href);
  queueMicrotask(onClose);
}
