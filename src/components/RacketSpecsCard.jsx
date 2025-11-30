import React from 'react';

export default function RacketSpecsCard({ racket }) {
  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    fontSize: 15,
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 20,
        padding: 24,
        boxShadow: '0 6px 16px rgba(0,0,0,0.07)',
        marginBottom: 40,
      }}
    >
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
        Especificações Técnicas
      </h2>

      <div style={rowStyle}>
        <span>Peso</span>
        <span>{racket.weight}</span>
      </div>
      <div style={rowStyle}>
        <span>Formato</span>
        <span>{racket.shape}</span>
      </div>
      <div style={rowStyle}>
        <span>Equilíbrio</span>
        <span>{racket.balance}</span>
      </div>
      <div style={rowStyle}>
        <span>Núcleo</span>
        <span>{racket.core_type}</span>
      </div>
      <div style={rowStyle}>
        <span>Faces</span>
        <span>{racket.surface_type}</span>
      </div>
      <div style={rowStyle}>
        <span>Rugosidade</span>
        <span>{racket.roughness}</span>
      </div>
      <div style={rowStyle}>
        <span>Perfil</span>
        <span>{racket.profile}</span>
      </div>
    </div>
  );
}
