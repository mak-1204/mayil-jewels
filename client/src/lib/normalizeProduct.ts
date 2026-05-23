import type { Product, ProductStyle } from "@/types";

const STYLE_MAP: Record<string, ProductStyle> = {
  Gold: "Antique",
  Diamond: "Imitation",
  Platinum: "Imitation",
  Silver: "Oxidised",
  Antique: "Antique",
  Imitation: "Imitation",
  Temple: "Temple",
  Kundan: "Kundan",
  Oxidised: "Oxidised",
};

/** Maps legacy Firebase/local records (metal/purity) to style/finish. */
export function normalizeProduct(raw: Record<string, unknown>): Product {
  const styleRaw =
    (raw.style as string) || (raw.metal as string) || "Imitation";
  const style = STYLE_MAP[styleRaw] ?? (styleRaw as ProductStyle);

  const finish =
    (raw.finish as string) ||
    (raw.purity as string) ||
    (styleRaw === "Gold" ? "Gold-tone" : undefined);

  const { metal: _m, purity: _p, ...rest } = raw;

  return {
    ...(rest as Product),
    style,
    finish,
  };
}
