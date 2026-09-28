import React from 'react';
import { Video, Sparkles, PenTool, ArrowRight, Laptop, Calendar } from 'lucide-react';

export default function StudentHome({ onNavigateToRegister }) {
  const courses = [
    {
      title: 'Curso de Postproducción',
      desc: 'Domina los fundamentos de edición y montaje profesional con herramientas líderes en la industria.',
      icon: Video,
      badge: 'Esencial'
    },
    {
      title: 'Curso de Postproducción Avanzado',
      desc: 'Técnicas complejas de flujos de trabajo, corrección de color avanzada y efectos visuales cinemáticos.',
      icon: Sparkles,
      badge: 'Pro'
    },
    {
      title: 'Curso de Escritura Creativa',
      desc: 'Desarrolla narrativas cautivadoras, estructura de guiones y técnicas avanzadas de storytelling.',
      icon: PenTool,
      badge: 'Creativo'
    },
  ];

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="relative bg-gradient-to-br from-indigo-950/40 via-zinc-900/40 to-zinc-900/80 border border-zinc-800/80 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-6 text-xs font-medium tracking-wide text-indigo-400 bg-indigo-500/10 rounded-full border border-indigo-500/20">
          <Calendar size={13} /> Sábado 3 de Octubre (1pm - 5pm)
        </span>
        
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Potencia tu talento audiovisual y creativo.
        </h1>
        <p className="text-zinc-400 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
          Formación intensiva orientada a la práctica. Recuerda que para los cursos es <strong className="text-zinc-200">obligatorio traer tu laptop</strong> con los programas instalados.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={onNavigateToRegister}
            className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-2xl transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
          >
            Inscribirse Ahora <ArrowRight size={18} />
          </button>
          
          <div className="flex items-center gap-2 px-5 py-3.5 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 rounded-2xl text-sm">
            <Laptop size={18} className="text-indigo-400" /> Modalidad Presencial / Laptop Obligatoria
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-6">Cursos Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div 
                key={idx}
                className="group bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/50 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-full">
                      {c.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{c.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{c.desc}</p>
                </div>
                
                <button
                  onClick={onNavigateToRegister}
                  className="mt-6 w-full py-2.5 bg-zinc-800/80 hover:bg-indigo-600 text-zinc-300 hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Seleccionar Curso <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}