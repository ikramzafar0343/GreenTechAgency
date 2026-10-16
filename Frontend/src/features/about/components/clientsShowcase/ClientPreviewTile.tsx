"use client";

import Image from "next/image";
import type { AboutClientItem } from "@/features/about/model/aboutPageTypes";
import styles from "@/features/about/components/clientsShowcase/clientsShowcase.module.css";

type ClientPreviewTileProps = {
  item: AboutClientItem | null;
  reduceMotion: boolean;
};

export function ClientPreviewTile({ item, reduceMotion }: ClientPreviewTileProps) {
  const monogram = item?.name.trim().charAt(0).toUpperCase() ?? "";

  return (
    <div
      className={styles.preview}
      aria-hidden="true"
      data-client-preview={item?.id ?? ""}
    >
      <div
        key={item?.id ?? "empty"}
        className={styles.previewMedia}
        style={{
          animation: reduceMotion ? "none" : "clientsPreviewIn 0.28s ease both",
        }}
      >
        {item?.logoSrc ? (
          <Image
            key={item.logoSrc}
            src={item.logoSrc}
            alt=""
            width={item.logoWidth}
            height={item.logoHeight}
            sizes="(max-width: 767px) 120px, 144px"
            priority={false}
          />
        ) : (
          <span className={styles.previewMonogram}>{monogram}</span>
        )}
      </div>
    </div>
  );
}
