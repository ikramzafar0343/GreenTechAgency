"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TestimonialCard } from "@/features/testimonials/components/TestimonialCard";
import { TestimonialTrustCard } from "@/features/testimonials/components/TestimonialTrustCard";
import { buildWallColumns } from "@/features/testimonials/lib/buildWallColumns";
import {
  gapForColumnCount,
  resolveColumnCount,
} from "@/features/testimonials/lib/resolveColumnCount";
import {
  columnOffsetForIndex,
  maxColumnOffset,
} from "@/features/testimonials/lib/wallOffsets";
import { DEFAULT_TRUST_BADGE } from "@/features/testimonials/model/trustBadge";
import type {
  TestimonialItem,
  TestimonialsTrustBadge,
} from "@/features/testimonials/model/types";
import styles from "@/features/testimonials/styles/testimonials.module.css";

type TestimonialsWallProps = {
  items: TestimonialItem[];
  trustBadge?: TestimonialsTrustBadge;
  scrollAnimationEnabled: boolean;
};

export function TestimonialsWall({
  items,
  trustBadge = DEFAULT_TRUST_BADGE,
  scrollAnimationEnabled: _scrollAnimationEnabled,
}: TestimonialsWallProps) {
  void _scrollAnimationEnabled;
  const wallRef = useRef<HTMLDivElement>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [columnCount, setColumnCount] = useState(5);
  const [finePointer, setFinePointer] = useState(false);

  useLayoutEffect(() => {
    const wall = wallRef.current;
    if (!wall) {
      return;
    }

    const sync = () => {
      const next = resolveColumnCount(wall.getBoundingClientRect().width);
      setColumnCount((current) => (current === next ? current : next));
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(wall);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const columns = useMemo(
    () => buildWallColumns(items, columnCount),
    [items, columnCount],
  );

  const gap = gapForColumnCount(columnCount);
  const staggerReserve = maxColumnOffset(columnCount);

  const closePinned = useCallback(() => {
    setPinnedId(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePinned();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const wall = wallRef.current;
      if (!wall || !pinnedId) {
        return;
      }
      if (event.target instanceof Node && !wall.contains(event.target)) {
        closePinned();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [closePinned, pinnedId]);

  return (
    <div
      ref={wallRef}
      className={styles.wall}
      data-columns={columnCount}
      style={{
        ["--tm-cols" as string]: String(columnCount),
        ["--tm-gap" as string]: `${gap}px`,
        ["--tm-stagger-reserve" as string]: `${staggerReserve}px`,
      }}
      onMouseLeave={() => setHoveredId(null)}
    >
      {columns.map((column, columnIndex) => {
        const offset = columnOffsetForIndex(columnCount, columnIndex);

        return (
          <div
            key={`column-${columnIndex}`}
            className={styles.column}
            data-tm-column
            data-column={columnIndex + 1}
            style={{ ["--tm-col-offset" as string]: `${offset}px` }}
          >
            {column.map((node) => {
              if (node.type === "trust") {
                return (
                  <TestimonialTrustCard
                    key="wall-trust"
                    badge={trustBadge}
                  />
                );
              }

              const item = node.item;
              const isPinned = pinnedId === item.id;
              const isOpen = isPinned || hoveredId === item.id;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    if (!pinnedId && finePointer) {
                      setHoveredId(item.id);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hoveredId === item.id) {
                      setHoveredId(null);
                    }
                  }}
                >
                  <TestimonialCard
                    item={item}
                    isOpen={isOpen}
                    isPinned={isPinned}
                    onTogglePin={() => {
                      setPinnedId((current) =>
                        current === item.id ? null : item.id,
                      );
                      setHoveredId(null);
                    }}
                    onRequestPin={() => {
                      setPinnedId(item.id);
                      setHoveredId(null);
                    }}
                    onClose={closePinned}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
