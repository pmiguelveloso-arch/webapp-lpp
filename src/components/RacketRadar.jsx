import React from 'react';

export default function RacketRadar({ data }) {
  const size = 260;
  const center = size / 2;
  const max = 5;
  const radius = 95;
  const angles = [270, 342, 54, 126, 198];

  const points = angles.map((angle, i) => {
    const value = (data[i].value / max) * radius;
    return {
      x: center + value * Math.cos((angle * Math.PI) / 180),
      y: center + value * Math.sin((angle * Math.PI) / 180),
    };
  });

  return (
    <svg width={size} height={size}>
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke="white"
        strokeOpacity="0.08"
        fill="none"
      />
      <circle
        cx={center}
        cy={center}
        r={radius * 0.66}
        stroke="white"
        strokeOpacity="0.06"
        fill="none"
      />
      <circle
        cx={center}
        cy={center}
        r={radius * 0.33}
        stroke="white"
        strokeOpacity="0.04"
        fill="none"
      />

      {/* Área */}
      <polygon
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="url(#grad)"
        stroke="#00aaff"
        strokeWidth="1.5"
      />

      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00aaff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#00ffaa" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Labels */}
      {angles.map((angle, i) => (
        <text
          key={i}
          x={center + (radius + 18) * Math.cos((angle * Math.PI) / 180)}
          y={center + (radius + 18) * Math.sin((angle * Math.PI) / 180)}
          textAnchor="middle"
          fill="#ccc"
          fontSize="11"
        >
          {data[i].label}
        </text>
      ))}
    </svg>
  );
}
