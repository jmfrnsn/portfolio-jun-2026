/** Tuned maximums at intensity = 1 (current newspaper bleed look). */
const INK_BLEED_MAX = {
  dilateRadius: 0.3,
  maskBlur: 0.32,
  washOpacity: 0.22,
  speckleAlphaScale: 2.1,
  speckleThreshold: -0.35,
  speckleBlur: 0.2,
  displacement: 0.45,
} as const;

export type InkBleedParams = {
  enabled: boolean;
  dilateRadius: number;
  maskBlur: number;
  washOpacity: number;
  speckleAlphaScale: number;
  speckleThreshold: number;
  speckleBlur: number;
  displacement: number;
};

export function getInkBleedParams(intensity: number): InkBleedParams {
  const t = Math.max(0, Math.min(1, intensity));

  return {
    enabled: t > 0.01,
    dilateRadius: INK_BLEED_MAX.dilateRadius * t,
    maskBlur: INK_BLEED_MAX.maskBlur * t,
    washOpacity: INK_BLEED_MAX.washOpacity * t,
    speckleAlphaScale: 1 + (INK_BLEED_MAX.speckleAlphaScale - 1) * t,
    speckleThreshold:
      INK_BLEED_MAX.speckleThreshold - (1 - t) * 0.3,
    speckleBlur: INK_BLEED_MAX.speckleBlur * t,
    displacement: INK_BLEED_MAX.displacement * t,
  };
}
