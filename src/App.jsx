import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import Compare from './pages/Compare.jsx';
import CompareBar from './components/CompareBar.jsx';
import RacketPage from './pages/RacketPage.jsx';

function Navbar() {
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path
      ? 'text-white'
      : 'text-slate-300 hover:text-white';

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-400 text-sm font-bold">
            🎾
          </div>
          <span className="text-sm font-semibold tracking-tight">
            Loucos por Padel
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-xs">
          <Link to="/explorar" className={isActive('/explorar')}>
            Explorar
          </Link>
          <Link to="/comparar" className={isActive('/comparar')}>
            Comparar
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explorar" element={<Explore />} />
        <Route path="/comparar" element={<Compare />} />
        <Route path="/raquete/:id" element={<RacketPage />} />
      </Routes>
      <CompareBar />
    </>
  );
}
