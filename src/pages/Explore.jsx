import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import rackets from '../data/rackets/index.js';
import { subscribeCompare, toggleCompareId } from '../store/compareStore.js';
import CompareBar from '../components/CompareBar.jsx';

export default function Explore() {
  const [ids, setIds] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => subscribeCompare(setIds), []);

  const list = useMemo(
    () =>
      rackets.filter((r) => {
        const s = `${r.brand} ${r.model}`.toLowerCase();
        return s.includes(q.toLowerCase());
      }),
    [q]
  );

  return (
    <main className="max-w-5xl mx-auto px-4 pt-10 pb-24">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">
            Explorar raquetes
          </h1>
          <p className="text-xs text-slate-400">
            Filtra por marca ou pesquisa diretamente pelo modelo.
          </p>
        </div>
        <input
          className="w-full sm:w-64 rounded-2xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
          placeholder="Procurar marca ou modelo..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => {
          const selected = ids.includes(r.id);
          const c = r.characteristics || {};

          return (
            <article
              key={r.id}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 flex flex-col gap-3 shadow-soft/40"
            >
              {/* --- BLOCO CLICÁVEL PARA A FICHA DA RAQUETE --- */}
              <Link
                to={`/raquete/${r.id}`}
                className="block"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="relative rounded-xl bg-slate-800/80 overflow-hidden aspect-[4/3]">
                  {r.image_url ? (
                    <img
                      src={r.image_url}
                      alt={r.model}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                      Sem imagem
                    </div>
                  )}

                  <div className="absolute inset-x-2 bottom-2 rounded-xl bg-black/55 backdrop-blur-md px-3 py-2 text-[11px] text-slate-100 flex items-center justify-between gap-2">
                    <span>
                      Potência {c.power ?? '-'} · Controlo {c.control ?? '-'}
                    </span>
                    <span className="font-semibold text-primary">
                      €{r.price_msrv}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-bold">
                    {r.brand} {r.model}{' '}
                    {r.year ? (
                      <span className="text-[11px] text-slate-400">
                        ({r.year})
                      </span>
                    ) : null}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {r.shape} · {r.balance} · {r.weight}
                  </p>
                </div>
              </Link>
              {/* --- Fim da zona clicável --- */}

              {/* BOTÕES DE AÇÃO */}
              <div className="mt-auto flex gap-2 pt-1">
                <Link
                  to={`/raquete/${r.id}`}
                  className="flex-1 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100"
                >
                  Ver ficha
                </Link>

                <button
                  onClick={() => toggleCompareId(r.id)}
                  className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold ${
                    selected
                      ? 'bg-emerald-400 text-black'
                      : 'bg-primary text-white'
                  }`}
                >
                  {selected ? 'Selecionada' : 'Comparar'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <CompareBar />
    </main>
  );
}
