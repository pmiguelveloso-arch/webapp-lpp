import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import rackets from "../data/rackets/index.js";
import {
  getCompareIds,
  subscribeCompare,
  removeCompareId
} from "../store/compareStore.js";
import RadarComparison from "../components/RadarComparison.jsx";

/* ---------- Match Rate ---------- */
function calculateMatchRate(racket, playerType = "equilibrado") {
  const { power = 0, control = 0, comfort = 0 } = racket.characteristics || {};
  switch (playerType) {
    case "agressivo":
      return Math.min(
        100,
        Math.round((power * 18 + comfort * 2 + control * 5) * 3.2)
      );
    case "defensivo":
      return Math.min(
        100,
        Math.round((control * 18 + comfort * 4 + power * 4) * 3.1)
      );
    default:
      return Math.min(
        100,
        Math.round((power * 10 + control * 10 + comfort * 5) * 3)
      );
  }
}

/* ---------- Barrinha Match ---------- */
function MatchBar({ value = 80 }) {
  const [width, setWidth] = useState("0%");
  useEffect(() => {
    const t = setTimeout(() => setWidth(`${value}%`), 150);
    return () => clearTimeout(t);
  }, [value]);

  const color =
    value >= 85
      ? "rgba(16, 185, 129, 0.95)"
      : value >= 70
      ? "rgba(59, 130, 246, 0.95)"
      : "rgba(249, 115, 22, 0.95)";

  return (
    <div className="w-11/12 mx-auto mb-3">
      <div className="relative h-3 rounded-full bg-white/10 overflow-hidden backdrop-blur-sm">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width,
            background: `linear-gradient(90deg, ${color}, rgba(248,250,252,0.7))`
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white drop-shadow">
          {value}%
        </div>
      </div>
    </div>
  );
}

/* ---------- Tecnologias Dropdown ---------- */
function TechDropdown({ techs }) {
  const [open, setOpen] = useState(null);
  const icons = ["💡", "⚙️", "🧬", "💎", "🪶", "🔩", "🎯", "🔥"];
  if (!techs || !techs.length) return null;

  return (
    <div className="mt-3">
      <div className="text-xs font-semibold text-primary mb-1.5">
        Tecnologias principais
      </div>
      {techs.map((t, i) => (
        <div
          key={i}
          className="mb-2 rounded-xl border border-white/10 bg-white/5 overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-100"
          >
            <span className="flex items-center gap-2">
              <span>{icons[i % icons.length]}</span>
              <span>{t.label}</span>
            </span>
            <span
              className={`transition-transform duration-200 ${
                open === i ? "rotate-90" : ""
              }`}
            >
              ▸
            </span>
          </button>
          <div
            className="transition-[max-height] duration-300 ease-out bg-black/35"
            style={{ maxHeight: open === i ? 120 : 0 }}
          >
            <p className="px-3 py-2 text-[11px] text-slate-300 leading-relaxed">
              {t.note}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Melhor para ---------- */
function getPlayerRecommendation(r) {
  const { power, control } = r.characteristics || {};
  if (power > control + 0.5)
    return {
      text: "Jogadores ofensivos que valorizam potência e agressividade.",
      icon: "💥"
    };
  if (control > power + 0.5)
    return {
      text: "Jogadores defensivos que privilegiam precisão e estabilidade.",
      icon: "🧱"
    };
  return {
    text: "Jogadores equilibrados que procuram versatilidade.",
    icon: "⚖️"
  };
}

/* ---------- Análise Técnica ---------- */
function generateInsights(selected) {
  if (!selected || selected.length < 2) return null;
  const [r1, r2] = selected;
  const keys = ["power", "control", "comfort", "maneuverability", "balance"];
  const avgDiff =
    keys.reduce(
      (acc, k) =>
        acc +
        Math.abs(
          (r1.characteristics?.[k] ?? 0) - (r2.characteristics?.[k] ?? 0)
        ),
      0
    ) / keys.length;
  const score = Math.max(0, Math.round(100 - avgDiff * 20));

  return {
    summary: `A ${r1.brand} ${r1.model} apresenta um perfil ${
      (r1.characteristics?.power ?? 0) >
      (r1.characteristics?.control ?? 0)
        ? "mais ofensivo e explosivo"
        : "mais equilibrado e técnico"
    }, enquanto a ${r2.brand} ${
      r2.model
    } se distingue pela combinação de ${"conforto e manobrabilidade"} sem perder demasiado controlo.`,
    matchScore: score
  };
}

/* ---------- Página Compare ---------- */
export default function Compare() {
  const location = useLocation();
  const [ids, setIds] = useState(location.state?.ids || getCompareIds());

  useEffect(() => subscribeCompare(setIds), []);

  const selected = useMemo(
    () => rackets.filter((r) => ids.includes(r.id)),
    [ids]
  );
  const playerType = localStorage.getItem("player_type") || "equilibrado";
  const insight = useMemo(() => generateInsights(selected), [selected]);

  if (selected.length < 2) {
    return (
      <main className="max-w-3xl mx-auto px-4 pt-14 pb-24 text-center">
        <h2 className="text-2xl font-extrabold">Nenhuma comparação ativa</h2>
        <p className="text-sm text-slate-400 mt-2">
          Escolhe pelo menos duas raquetes na página de exploração para
          desbloquear a comparação lado a lado.
        </p>
        <Link
          to="/explorar"
          className="mt-6 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          Explorar raquetes
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 pt-10 pb-32">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          Comparar raquetes
        </h1>
        <p className="text-xs text-slate-400 mt-2">
          Perfis técnicos, match com o teu estilo de jogo e tecnologias em
          detalhe.
        </p>
      </header>

      {/* Cartões das raquetes */}
      <section className="grid gap-4 md:grid-cols-2">
        {selected.map((r) => {
          const reco = getPlayerRecommendation(r);
          const match = calculateMatchRate(r, playerType);
          const c = r.characteristics || {};
          return (
            <article
              key={r.id}
              className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-soft flex flex-col gap-3"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>{r.brand}</span>
                <button
                  onClick={() => removeCompareId(r.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remover
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-800/80 overflow-hidden aspect-[4/3] flex items-center justify-center">
                {r.image_url ? (
                  <img
                    src={r.image_url}
                    alt={r.model}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-xs text-slate-400">Sem imagem</div>
                )}
              </div>

              <MatchBar value={match} />

              <div className="text-center">
                <h2 className="text-lg font-semibold">
                  {r.brand} {r.model}
                </h2>
                <p className="text-sm text-primary font-semibold mt-1">
                  €{r.price_msrv}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {r.shape} · {r.balance} · {r.weight}
                </p>
              </div>

              {/* Especificações técnicas */}
              <div className="mt-3 border-t border-white/10 pt-3">
                <div className="text-xs font-semibold text-primary mb-1.5">
                  Especificações técnicas
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-200">
                  <li>⚖ Peso: {r.weight}</li>
                  <li>⬡ Formato: {r.shape}</li>
                  <li>⚙ Equilíbrio: {r.balance}</li>
                  <li>💠 Núcleo: {r.core_type}</li>
                  <li>🩶 Faces: {r.surface_type}</li>
                  <li>🌫 Rugosidade: {r.roughness}</li>
                  <li>📏 Espessura: {r.profile}</li>
                </ul>
              </div>

              {/* Melhor para */}
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-slate-200">
                <div className="font-semibold">
                  {reco.icon} Melhor para:
                </div>
                <p className="mt-1 text-slate-300">{reco.text}</p>
              </div>

              {/* Tecnologias */}
              <TechDropdown techs={r.technologies} />
            </article>
          );
        })}
      </section>

      {/* Radar de comparação */}
      <section className="mt-10">
        <RadarComparison selected={selected} />
      </section>

      {/* Análise técnica automática */}
      {insight && (
        <section className="mt-10 max-w-2xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-primary">
            Análise técnica automática
          </h3>
          <p className="mt-2 text-sm text-slate-200 leading-relaxed">
            {insight.summary}
          </p>
          <div className="mt-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-100">
            Similaridade global entre modelos:{" "}
            <span className="ml-2 text-primary">{insight.matchScore}%</span>
          </div>
        </section>
      )}
    </main>
  );
}
