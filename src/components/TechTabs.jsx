import React, { useState } from 'react';

export default function TechTabs({ items }) {
  const [active, setActive] = useState(0);

  return (
    <div className="w-full">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-5 py-3 rounded-2xl whitespace-nowrap text-sm font-semibold transition-all
            ${
              active === i
                ? 'bg-white text-black shadow-lg scale-100'
                : 'bg-white/10 text-white/70 backdrop-blur-sm hover:bg-white/20'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5 p-5 rounded-2xl bg-white/5 border border-white/10 text-[15px] text-slate-300 leading-relaxed">
        {items[active].note}
      </div>
    </div>
  );
}
