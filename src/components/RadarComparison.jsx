import React, { useEffect, useMemo, useState } from "react";

const METRICS = [
  { key: "power", label: "Potência" },
  { key: "control", label: "Controlo" },
  { key: "comfort", label: "Conforto" },
  { key: "maneuverability", label: "Maneabilidade" },
  { key: "balance", label: "Equilíbrio" }
];

const brandColor = (brand) => {
  const b = String(brand || "").toLowerCase();
  const map = {
    head: { from: "#34a7ff", to: "#9ad1ff" },
    nox: { from: "#ff6a6a", to: "#ffb0b0" },
    adidas: { from: "#bfbfbf", to: "#e7e7e7" },
    bullpadel: { from: "#ffa45b", to: "#ffd1a6" },
    babolat: { from: "#56d2ff", to: "#a8eaff" }
  };
  return map[b] || { from: "#0A84FF", to: "#7cc0ff" };
};

function polarPoint(cx, cy, r, angleDeg) {
  const rad = (Math.PI / 180) * angleDeg;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function polygonPath(points) {
  return (
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ") +
    " Z"
  );
}

export default function RadarComparison({ selected = [] }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = null;
    const duration = 1100;
    const step = (t) => {
      if (!start) start = t;
      const e = t - start;
      setProgress(Math.min(1, e / duration));
      if (e < duration) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [selected]);

  const data = useMemo(
    () =>
      selected.slice(0, 3).map((r) => {
        const c = r.characteristics || {};
        return {
          id: r.id,
          brand: r.brand,
          model: r.model,
          values: METRICS.map((m) =>
            Math.max(0, Math.min(1, (Number(c[m.key]) || 0) / 5))
          )
        };
      }),
    [selected]
  );

  const size = 520;
  const cx = size / 2;
  const cy = size / 2 + 6;
  const radius = 190;
  const angles = METRICS.map(
    (_, i) => -90 + (360 / METRICS.length) * i
  );
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-soft">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">Comparação visual</h2>
        <p className="text-xs text-slate-300">
          Perfil técnico lado a lado: potência, controlo, conforto, maneabilidade e equilíbrio.
        </p>
      </div>
      <div className="w-full flex justify-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-3xl"
          role="img"
          aria-label="Gráfico radar de comparação"
        >
          <defs>
            {data.map((r, idx) => {
              const col = brandColor(r.brand);
              return (
                <React.Fragment key={r.id}>
                  <linearGradient
                    id={`grad-${idx}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={col.from} />
                    <stop offset="100%" stopColor={col.to} />
                  </linearGradient>
                  <filter
                    id={`glow-${idx}`}
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </React.Fragment>
              );
            })}
          </defs>

          {rings.map((r, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius * r}
              fill="none"
              stroke={i === rings.length - 1 ? "rgba(148,163,184,0.55)" : "rgba(148,163,184,0.25)"}
              strokeWidth={i === rings.length - 1 ? 1.4 : 1}
            />
          ))}

          {angles.map((ang, i) => {
            const [x, y] = polarPoint(cx, cy, radius, ang);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(148,163,184,0.25)"
                strokeWidth="1"
              />
            );
          })}

          {angles.map((ang, i) => {
            const [x, y] = polarPoint(cx, cy, radius + 18, ang);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#e5e7eb"
                fontSize="11"
                fontWeight="600"
              >
                {METRICS[i].label}
              </text>
            );
          })}

          {data.map((r, idx) => {
            const col = brandColor(r.brand);
            const pts = r.values.map((v, i) =>
              polarPoint(cx, cy, v * radius * progress, angles[i])
            );
            const path = polygonPath(pts);
            return (
              <g key={r.id} style={{ filter: `url(#glow-${idx})` }}>
                <path
                  d={path}
                  fill={`url(#grad-${idx})`}
                  opacity="0.26"
                />
                <path
                  d={path}
                  fill="none"
                  stroke={`url(#grad-${idx})`}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {pts.map((p, i) => (
                  <circle
                    key={i}
                    cx={p[0]}
                    cy={p[1]}
                    r="3"
                    fill="white"
                    stroke={`url(#grad-${idx})`}
                    strokeWidth="2"
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {data.map((r, idx) => {
          const col = brandColor(r.brand);
          return (
            <div
              key={r.id}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${col.from}, ${col.to})`
                }}
              />
              {r.brand} {r.model}
            </div>
          );
        })}
      </div>
    </div>
  );
}
