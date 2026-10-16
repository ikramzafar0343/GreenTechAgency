export const DOT_SPACING = 30;
export const CURSOR_RADIUS = 130;
export const BASE_DOT_RADIUS = 1.2;
export const RADIUS_BOOST = 1.2;
export const BASE_OPACITY = 0.18;
export const OPACITY_BOOST = 0.62;
export const MAX_DISPLACEMENT = 4;
export const MAX_DPR = 2;

export type RgbColor = { r: number; g: number; b: number };

export type DotFieldPaintState = {
  width: number;
  height: number;
  pointerX: number;
  pointerY: number;
  influence: number;
  interactive: boolean;
  baseColor: RgbColor;
  activeColor: RgbColor;
};

const FALLBACK_NAVY: RgbColor = { r: 12, g: 43, b: 71 };
const FALLBACK_CYAN: RgbColor = { r: 77, g: 232, b: 244 };

export function parseCssColor(value: string, fallback: RgbColor): RgbColor {
  const trimmed = value.trim();
  const rgbMatch = trimmed.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i,
  );
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
    };
  }

  const hexMatch = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1]!;
    if (hex.length === 3) {
      return {
        r: Number.parseInt(hex[0]! + hex[0]!, 16),
        g: Number.parseInt(hex[1]! + hex[1]!, 16),
        b: Number.parseInt(hex[2]! + hex[2]!, 16),
      };
    }
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    };
  }

  return fallback;
}

export function readThemeDotColors(element: Element): {
  baseColor: RgbColor;
  activeColor: RgbColor;
} {
  const styles = getComputedStyle(element);
  const navyToken =
    styles.getPropertyValue("--hww-ink").trim() ||
    styles.getPropertyValue("--brand-navy-panel").trim();
  const cyanToken =
    styles.getPropertyValue("--hww-accent").trim() ||
    styles.getPropertyValue("--brand-cyan").trim();
  return {
    baseColor: parseCssColor(navyToken, FALLBACK_NAVY),
    activeColor: parseCssColor(cyanToken, FALLBACK_CYAN),
  };
}

export function sizeDotFieldCanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
): { width: number; height: number; dpr: number } {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const width = Math.max(1, Math.floor(cssWidth));
  const height = Math.max(1, Math.floor(cssHeight));
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const context = canvas.getContext("2d");
  if (context) {
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  return { width, height, dpr };
}

function mixColor(a: RgbColor, b: RgbColor, amount: number): RgbColor {
  const t = Math.min(1, Math.max(0, amount));
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

export function paintDotField(
  context: CanvasRenderingContext2D,
  state: DotFieldPaintState,
): void {
  const {
    width,
    height,
    pointerX,
    pointerY,
    influence,
    interactive,
    baseColor,
    activeColor,
  } = state;

  context.clearRect(0, 0, width, height);

  const columns = Math.ceil(width / DOT_SPACING) + 1;
  const rows = Math.ceil(height / DOT_SPACING) + 1;
  const offsetX = (width - (columns - 1) * DOT_SPACING) / 2;
  const offsetY = (height - (rows - 1) * DOT_SPACING) / 2;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const originX = offsetX + column * DOT_SPACING;
      const originY = offsetY + row * DOT_SPACING;
      let drawX = originX;
      let drawY = originY;
      let radius = BASE_DOT_RADIUS;
      let alpha = BASE_OPACITY;
      let color = baseColor;

      if (interactive && influence > 0.001) {
        const dx = originX - pointerX;
        const dy = originY - pointerY;
        const distance = Math.hypot(dx, dy);
        const proximity = Math.max(0, 1 - distance / CURSOR_RADIUS);
        const local = proximity * proximity * influence;

        if (local > 0) {
          radius = BASE_DOT_RADIUS + local * RADIUS_BOOST;
          alpha = BASE_OPACITY + local * OPACITY_BOOST;
          color = mixColor(baseColor, activeColor, local * 0.7);
          if (distance > 0.001) {
            const push = local * MAX_DISPLACEMENT;
            drawX += (dx / distance) * push;
            drawY += (dy / distance) * push;
          }
        }
      }

      context.beginPath();
      context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
      context.arc(drawX, drawY, radius, 0, Math.PI * 2);
      context.fill();
    }
  }
}
