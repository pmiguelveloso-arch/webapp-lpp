// Agrega tudo o que estiver em src/data/rackets/** menos index.js

const modules = import.meta.glob("./**/*.js", { eager: true });

function toArray(m) {
  try {
    const v = m?.default ?? m;
    return v ? (Array.isArray(v) ? v : [v]) : [];
  } catch {
    return [];
  }
}

function slug(s) {
  return String(s || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalize(r) {
  if (!r || typeof r !== "object") return null;
  const yearNum = r.year != null ? Number(r.year) : undefined;
  const id =
    r.id ||
    [r.brand, r.model, r.year].filter(Boolean).map(slug).join("-");

  return {
    ...r,
    id,
    brand: r.brand || "",
    model: r.model || "",
    year: Number.isFinite(yearNum) ? yearNum : undefined,
    characteristics: r.characteristics || {}
  };
}

const seen = new Set();
const rackets = Object.entries(modules)
  .filter(([p]) => !/\/index\.js$/i.test(p))
  .flatMap(([, m]) => toArray(m))
  .map(normalize)
  .filter(Boolean)
  .filter((r) => {
    if (!r.id) return false;
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });

export default rackets;
export const getById = (id) => rackets.find((r) => r.id === id);
export const listIds = () => rackets.map((r) => r.id);
