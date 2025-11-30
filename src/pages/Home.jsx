import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 pt-10 pb-24">
      <section className="rounded-3xl border border-white/10 bg-slate-900/70 px-6 sm:px-10 py-10 shadow-soft">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              O comparador de raquetes para{" "}
              <span className="text-primary">loucos por padel</span>.
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl">
              Compara modelos de topo, vê perfis técnicos reais, match com o teu
              estilo de jogo e toma decisões com confiança — tudo num só lugar.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/explorar"
                className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft"
              >
                Explorar raquetes
              </Link>
              <Link
                to="/comparar"
                className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100"
              >
                Ir para comparação
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-64 rounded-[32px] bg-gradient-to-br from-primary/40 via-fuchsia-500/30 to-cyan-400/40 p-4 shadow-soft">
              <div className="absolute inset-4 rounded-[26px] bg-slate-950/80 border border-white/20 backdrop-blur-2xl flex flex-col justify-center items-center gap-3">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-300">
                  Perfil de raquete
                </div>
                <div className="text-lg font-semibold">Metalbone HRD 2025</div>
                <div className="flex gap-2 text-xs text-slate-300">
                  <span>Potência 4.9</span>·<span>Controlo 4.1</span>
                </div>
                <div className="mt-2 w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-primary to-emerald-300" />
                </div>
                <div className="mt-4 text-[11px] text-slate-400">
                  Match com perfil ofensivo:{" "}
                  <span className="text-primary font-semibold">93%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
