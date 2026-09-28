import React, { useState } from 'react';
import { User, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export default function RoleSelector({ onSelectRole }) {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (pin === '2026') {
      onSelectRole('admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-widest text-indigo-400 uppercase bg-indigo-500/10 rounded-full border border-indigo-500/20">
            Acceso al Sistema
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white">Portal Académico</h1>
          <p className="text-zinc-400 text-sm mt-2">Selecciona tu perfil para continuar con la experiencia.</p>
        </div>

        {!showPinModal ? (
          <div className="space-y-4">
            <button
              onClick={() => onSelectRole('student')}
              className="w-full group relative flex items-center justify-between p-5 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/50 hover:border-indigo-500/50 rounded-2xl transition-all duration-300 text-left cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                  <User size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Soy Estudiante</h3>
                  <p className="text-xs text-zinc-400">Inscríbete, revisa cursos y seguimiento</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => setShowPinModal(true)}
              className="w-full group relative flex items-center justify-between p-5 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/50 hover:border-violet-500/50 rounded-2xl transition-all duration-300 text-left cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl group-hover:scale-110 transition-transform">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Soy Administrador</h3>
                  <p className="text-xs text-zinc-400">Gestión de alumnos y contenidos</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleAdminSubmit} className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Lock size={15} className="text-violet-400" /> Ingresa el PIN de acceso
              </label>
              <button 
                type="button" 
                onClick={() => { setShowPinModal(false); setError(false); setPin(''); }}
                className="text-xs text-zinc-500 hover:text-zinc-300"
              >
                Volver
              </button>
            </div>
            
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(false); }}
              placeholder="••••"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-xl px-4 py-3 text-center text-2xl tracking-widest text-white outline-none transition-all"
              autoFocus
            />
            {error && <p className="text-xs text-red-400 text-center">PIN incorrecto. (Prueba con 2026)</p>}

            <button
              type="submit"
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-violet-600/20 cursor-pointer"
            >
              Verificar PIN
            </button>
          </form>
        )}
      </div>
    </div>
  );
}