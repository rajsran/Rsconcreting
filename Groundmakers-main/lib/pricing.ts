export const PRICING: Record<string, Record<string, { low: number; high: number; unit: "m²" | "lm" }>> = {
  Concreting: {
    "Plain Concrete":      { low: 60,  high: 70,  unit: "m²" },
    "Coloured Concrete":   { low: 70,  high: 80,  unit: "m²" },
    "Exposed Aggregate":   { low: 100, high: 110, unit: "m²" },
  },
  Landscaping: {
    "Full Garden Design":   { low: 80,  high: 150, unit: "m²" },
    "Turf / Instant Lawn":  { low: 30,  high: 60,  unit: "m²" },
    "Artificial Grass":     { low: 70,  high: 120, unit: "m²" },
    "Paving & Hardscaping": { low: 63,  high: 170, unit: "m²" },
  },
  Decking: {
    "Hardwood (Merbau)":   { low: 280, high: 290, unit: "m²" },
    "Composite Decking":   { low: 300, high: 320, unit: "m²" },
  },
  Fencing: {
    "Colorbond Steel": { low: 100, high: 120, unit: "lm" },
    "Timber Paling":   { low: 100, high: 120, unit: "lm" },
  },
};

export interface QuoteLead {
  service?: string;
  type?: string;
  size?: string;
  timeline?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface Estimate {
  low: number;
  high: number;
  unit: "m²" | "lm";
  quantity: number;
}

/** Unit (m² or lm) a service/type is priced in. Falls back on the service's first type. */
export function unitFor(a: QuoteLead): "m²" | "lm" {
  const types = a.service ? PRICING[a.service] : undefined;
  const p = (a.type && types?.[a.type]) || (types && Object.values(types)[0]);
  return p?.unit ?? "m²";
}

/** "45 m²" when a number was entered, otherwise the raw text (e.g. "To be measured on-site"). */
export function formatSize(a: QuoteLead): string {
  if (!a.size) return "—";
  const n = parseFloat(a.size);
  return !isNaN(n) && n > 0 ? `${n} ${unitFor(a)}` : a.size;
}

export function calcEstimate(a: QuoteLead): Estimate | null {
  if (!a.service || !a.type || !a.size) return null;
  const p = PRICING[a.service]?.[a.type];
  if (!p) return null;
  const n = parseFloat(a.size);
  if (isNaN(n) || n <= 0) return null;
  const round = (v: number) => Math.round((v * n) / 100) * 100;
  return { low: round(p.low), high: round(p.high), unit: p.unit, quantity: n };
}
