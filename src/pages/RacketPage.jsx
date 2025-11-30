import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import rackets from '../data/rackets/index.js';

/* ---------- Match Rate (Player Fit) ---------- */
function calculateMatchRate(racket, playerType = 'equilibrado') {
  const { power = 0, control = 0, comfort = 0 } = racket.characteristics || {};

  switch (playerType) {
    case 'agressivo':
      return Math.min(
        100,
        Math.round((power * 18 + comfort * 2 + control * 5) * 3.2)
      );
    case 'defensivo':
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

/* ---------- Match Bar ---------- */
function MatchBar({ value }) {
  return (
    <div className="w-full mt-3">
      <div className="relative h-3 rounded-full bg-white/10 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-primary/90 transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-300 mt-1 font-semibold">
        {value}% compatibilidade contigo
      </p>
    </div>
  );
}

/* ---------- Melhor para ---------- */
function getPlayerRecommendation(r) {
  const { power, control, comfort } = r.characteristics || {};

  if (power > control + 0.5)
    return {
      text: 'Jogadores ofensivos que valorizam potência e agressividade.',
      icon: '💥',
    };

  if (control > power + 0.5)
    return {
      text: 'Jogadores defensivos que procuram precisão e estabilidade.',
      icon: '🧱',
    };

  return {
    text: 'Jogadores equilibrados que querem versatilidade.',
    icon: '⚖️',
  };
}

/* ---------- Tecnologias ---------- */
function TechDropdown({ techs }) {
  const [open, setOpen] = React.useState(null);

  return (
    <div className="space-y-3">
      {techs.map((t, i) => (
        <div
          key={i}
          className="border border-white/10 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center px-4 py-3 bg-white/5 text-slate-100 font-semibold text-sm"
          >
            <span>⚙️ {t.label}</span>
            <span
              className={`transition-transform ${
                open === i ? 'rotate-90' : ''
              }`}
            >
              ›
            </span>
          </button>

          <div
            className={`px-4 text-slate-300 text-[13px] leading-relaxed transition-all ${
              open === i ? 'py-3 max-h-40' : 'max-h-0 overflow-hidden'
            }`}
          >
            {t.note}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Sugestões AI ---------- */
function findSimilarRackets(current) {
  return rackets
    .filter((r) => r.id !== current.id)
    .map((r) => {
      let score = 0;

      if (r.shape === current.shape) score += 30;
      if (r.balance === current.balance) score += 20;
      if (
        Math.abs(
          (r.characteristics?.power ?? 0) -
            (current.characteristics?.power ?? 0)
        ) < 0.5
      )
        score += 20;
      if (Math.abs((r.weight_min ?? 0) - (current.weight_min ?? 0)) < 10)
        score += 15;

      return { racket: r, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export default function RacketPage() {
  const { id } = useParams();
  const racket = rackets.find((r) => r.id === id);

  if (!racket)
    return (
      <div className="text-center pt-20 text-xl text-slate-100">
        Raquete não encontrada.
      </div>
    );

  const playerType = localStorage.getItem('player_type') || 'equilibrado';
  const matchRate = calculateMatchRate(racket, playerType);
  const recommendation = getPlayerRecommendation(racket);
  const suggestions = findSimilarRackets(racket);

  return (
    <main className="max-w-4xl mx-auto px-4 pt-10 pb-24 text-slate-100">
      {/* HERO */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-1">
          {racket.brand} {racket.model}
        </h1>
        <p className="text-slate-400 text-sm">{racket.year}</p>

        <div className="w-full max-w-xs mx-auto mt-6">
          <img
            src={racket.image_url}
            alt={racket.model}
            className="w-full rounded-2xl shadow-2xl"
          />
        </div>

        <MatchBar value={matchRate} />
      </header>

      {/* REVIEW SUMMARY */}
      <p className="text-slate-300 text-sm leading-relaxed text-center max-w-xl mx-auto">
        {racket.review_summary}
      </p>

      {/* SPECIFICAÇÕES */}
      <section className="mt-10">
        <h2 className="text-xl font-bold mb-3">Especificações Técnicas</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            ⚖️ <b>Peso:</b> {racket.weight}
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            🟦 <b>Formato:</b> {racket.shape}
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            🎯 <b>Equilíbrio:</b> {racket.balance}
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            💠 <b>Núcleo:</b> {racket.core_type}
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            🩶 <b>Faces:</b> {racket.surface_type}
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            🌫 <b>Rugosidade:</b> {racket.roughness}
          </div>
        </div>
      </section>

      {/* MELHOR PARA */}
      <section className="mt-10 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
        <h2 className="font-bold mb-2">{recommendation.icon} Melhor para</h2>
        <p className="text-slate-300">{recommendation.text}</p>
      </section>

      {/* TECNOLOGIAS */}
      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">Tecnologias</h2>
        <TechDropdown techs={racket.technologies} />
      </section>

      {/* BOTÃO COMPARAR */}
      <div className="text-center mt-10">
        <Link
          to="/comparar"
          state={{ ids: [racket.id] }}
          className="px-5 py-3 rounded-full bg-primary text-white text-sm font-semibold"
        >
          Comparar esta raquete
        </Link>
      </div>

      {/* SUGESTÕES */}
      <section className="mt-14">
        <h2 className="text-xl font-bold mb-4">Semelhantes a esta</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {suggestions.map(({ racket: r, score }) => (
            <Link
              key={r.id}
              to={`/raquete/${r.id}`}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <img src={r.image_url} alt="" className="rounded-lg mb-2" />
              <p className="text-sm font-semibold">
                {r.brand} {r.model}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Score semelhança: {score}%
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
