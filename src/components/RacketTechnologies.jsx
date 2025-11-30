import React, { useState } from "react";

export default function RacketTechnologies({ techs = [] }) {
  const [open, setOpen] = useState(null);

  if (!techs.length) return null;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 6px 16px rgba(0,0,0,0.07)",
        marginBottom: 60,
      }}
    >
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
        Tecnologias
      </h2>

      {techs.map((t, i) => (
        <div
          key={i}
          style={{
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 12,
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              padding: "14px 18px",
              fontWeight: 600,
              fontSize: 15,
              border: "none",
              background: "transparent",
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            {t.label}
            <span style={{ transform: open === i ? "rotate(90deg)" : "rotate(0)" }}>
              ▸
            </span>
          </button>

          <div
            style={{
              maxHeight: open === i ? 200 : 0,
              overflow: "hidden",
              transition: "max-height .35s ease",
              background: "rgba(0,0,0,0.03)",
              padding: open === i ? "12px 18px" : "0 18px",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            {t.note}
          </div>
        </div>
      ))}
    </div>
  );
}
