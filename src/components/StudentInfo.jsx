import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen, FileDown, User, ExternalLink } from 'lucide-react';

export default function StudentInfo() {
  const [selectedCourseKey, setSelectedCourseKey] = useState('postproduccion');
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const coursesList = [
    { key: 'postproduccion', label: 'Postproducción' },
    { key: 'postproduccion-avanzado', label: 'Postproducción Avanzado' },
    { key: 'escritura-creativa', label: 'Escritura Creativa' },
  ];

  useEffect(() => {
    fetchCourseData(selectedCourseKey);
  }, [selectedCourseKey]);

  const fetchCourseData = async (key) => {
    setLoading(true);
    const { data } = await supabase
      .from('courses_content')
      .select('*')
      .eq('course_key', key)
      .single();

    setCourseInfo(data);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-white">Información de Cursos e Instructores</h2>
        <p className="text-xs text-zinc-400 mt-1">Selecciona un curso para conocer al instructor, su CV y descargar el pensum.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {coursesList.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedCourseKey(c.key)}
            className={`px-5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
              selectedCourseKey === c.key
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-zinc-500 text-sm">Cargando información del curso...</div>
      ) : courseInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl bg-zinc-800 overflow-hidden mb-4 border border-zinc-700/50 flex items-center justify-center">
              {courseInfo.instructor_photo_url ? (
                <img src={courseInfo.instructor_photo_url} alt="Instructor" className="w-full h-full object-cover" />
              ) : (
                <User size={36} className="text-zinc-600" />
              )}
            </div>
            
            <h3 className="font-bold text-white text-lg">{courseInfo.instructor_name}</h3>
            <span className="text-xs text-indigo-400 mt-0.5">Instructor Oficial</span>
            
            <p className="text-xs text-zinc-400 mt-4 leading-relaxed text-left bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/60 w-full">
              {courseInfo.instructor_bio}
            </p>

            {courseInfo.instructor_cv_url && (
              <a
                href={courseInfo.instructor_cv_url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Ver CV del Instructor <ExternalLink size={14} />
              </a>
            )}
          </div>

          <div className="md:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 mb-3">
                <BookOpen size={20} />
                <span className="text-xs font-semibold uppercase tracking-wider">Plan de Estudio</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Pensum Académico</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                El contenido está diseñado bajo estándares profesionales enfocados en resultados directos para el mercado actual.
              </p>
            </div>

            {courseInfo.syllabus_pdf_url ? (
              <a
                href={courseInfo.syllabus_pdf_url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <FileDown size={18} /> Descargar / Visualizar Pensum en PDF
              </a>
            ) : (
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs text-zinc-500 text-center">
                El archivo PDF del pensum aún no ha sido cargado por el administrador.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-zinc-900/40 border border-zinc-800 rounded-3xl text-zinc-400 text-sm">
          No hay información registrada para este curso en Supabase todavía.
        </div>
      )}
    </div>
  );
}