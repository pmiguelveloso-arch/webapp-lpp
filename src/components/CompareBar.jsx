import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import rackets from "../data/rackets/index.js";
import {
  subscribeCompare,
  removeCompareId,
  clearCompare
} from "../store/compareStore.js";

export default function CompareBar() {
  const [ids, setIds] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => subscribeCompare(setIds), []);

  const list = useMemo(
    () => rackets.filter((r) => ids.includes(r.id)),
    [ids]
  );

  if (!ids.length) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 flex justify-center px-3 pointer-events-none z-40">
      <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 shadow-soft backdrop-blur-xl max-w-3xl w-full">
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-100"
          >
            <span>Comparar raquetes</span>
            <span className="inline-flex items-center justify-center rounded-full bg-white text-black text-xs font-bold px-2 h-5">
              {ids.length}
            </span>
          </button>
        ) : (
          <>
            <div className="flex gap-2 flex-1">
              {list.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1 min-w-[160px]"
                >
                  <img
                    src={r.image_url}
                    alt=""
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="text-xs leading-tight">
                    <div className="font-bold">{r.brand}</div>
                    <div className="text-slate-300">{r.model}</div>
                  </div>
                  <button
                    onClick={() => removeCompareId(r.id)}
                    className="ml-auto text-xs font-bold text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              ))}
              {ids.length < 3 && (
                <Link
                  to="/explorar"
                  className="hidden sm:flex items-center justify-center rounded-xl border border-dashed border-slate-500/60 text-xs text-slate-200 px-3"
                >
                  + Adicionar modelo
                </Link>
              )}
            </div>
            <button
              onClick={() => navigate("/comparar", { state: { ids } })}
              disabled={ids.length < 2}
              className="flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              Comparar agora
              <span className="inline-flex items-center justify-center rounded-full bg-white text-black text-[10px] font-bold px-2 h-5 ml-2">
                {ids.length}
              </span>
            </button>
            <button
              onClick={clearCompare}
              className="hidden sm:inline-flex text-xs text-slate-300 hover:text-slate-100"
            >
              Limpar
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-100"
            >
              Fechar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
