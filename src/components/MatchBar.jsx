import React, { useEffect, useState } from 'react';

export default function MatchBar({ value }) {
  const [width, setWidth] = useState('0%');

  useEffect(() => {
    const t = setTimeout(() => setWidth(`${value}%`), 150);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div style={{ width: '80%', margin: '0 auto 20px' }}>
      <div
        style={{
          height: 10,
          borderRadius: 50,
          background: 'rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width,
            height: '100%',
            background: 'linear-gradient(90deg, #007aff, #60a5fa)',
            transition: 'width 0.8s ease',
            borderRadius: 50,
          }}
        />
      </div>
    </div>
  );
}
