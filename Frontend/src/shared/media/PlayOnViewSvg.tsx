import Image from "next/image";
import type { CSSProperties, ReactEventHandler } from "react";
import { isVectorAsset } from "@/shared/media/isVectorAsset";

export type PlayOnViewSvgProps = {
  src: string;
  alt: string;
  className?: string | undefined;
  fill?: boolean | undefined;
  width?: number | undefined;
  height?: number | undefined;
  sizes?: string | undefined;
  priority?: boolean | undefined;
  style?: CSSProperties | undefined;
  unoptimized?: boolean | undefined;
  onLoad?: ReactEventHandler<HTMLImageElement> | undefined;
  onError?: ReactEventHandler<HTMLImageElement> | undefined;
};

/**
 * Renders a marketing illustration. The generated SVGs animate themselves on a
 * loop, so they only need to reach the page as an image — no inlining, no
 * scroll trigger, nothing that can leave a frame blank if it fails.
 */
export function PlayOnViewSvg({
  src,
  alt,
  className,
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  style,
  unoptimized,
  onLoad,
  onError,
}: PlayOnViewSvgProps) {
  const isVector = isVectorAsset(src);

  const imageUnoptimized =
    unoptimized ??
    (isVector ||
      src.startsWith("/media/") ||
      src.startsWith("http://") ||
      src.startsWith("https://"));

  // Focal positioning is for photos; a cropped or offset vector scene loses widgets.
  const fitStyle: CSSProperties = isVector
    ? { ...style, objectFit: "contain", objectPosition: "center" }
    : { ...style };

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        style={fitStyle}
        priority={priority}
        unoptimized={imageUnoptimized}
        onLoad={onLoad}
        onError={onError}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 900}
      sizes={sizes}
      className={className}
      style={fitStyle}
      priority={priority}
      unoptimized={imageUnoptimized}
      onLoad={onLoad}
      onError={onError}
    />
  );
}
