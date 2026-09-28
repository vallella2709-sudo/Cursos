import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, UploadCloud, LogOut, RefreshCw } from 'lucide-react';

export default function AdminPanel({ onBack }) {
  const [activeSubTab, setActiveSubTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [courseKey, setCourseKey] = useState('postproduccion');
  const [instructorName, setInstructorName] = useState('');
  const [instructorBio, setInstructorBio] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (data) setStudents(data);
    setLoading(false);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Preinscrito' ? 'Inscrito' : 'Preinscrito';
    await supabase.from('students').update({ status: newStatus }).eq('id', id);
    fetchStudents();
  };

  const handleCMSUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    let photoUrl = null;
    let cvUrl = null;
    let pdfUrl = null;

    try {
      if (photoFile) {
        const path = `instructors/${Date.now()}_${photoFile.name}`;
        await supabase.storage.from('course-assets').upload(path, photoFile);
        const { data } = supabase.storage.from('course-assets').getPublicUrl(path);
        photoUrl = data.publicUrl;
      }

      if (cvFile) {
        const path = `cvs/${Date.now()}_${cvFile.name}`;
        await supabase.storage.from('course-assets').upload(path, cvFile);
        const { data } = supabase.storage.from('course-assets').getPublicUrl(path);
        cvUrl = data.publicUrl;
      }

      if (pdfFile) {
        const path = `pensums/${Date.now()}_${pdfFile.name}`;
        await supabase.storage.from('course-assets').upload(path, pdfFile);
        const { data } = supabase.storage.from('course-assets').getPublicUrl(path);
        pdfUrl = data.publicUrl;
      }

      const payload = {
        course_key: courseKey,
        instructor_name: instructorName,
        instructor_bio: instructorBio,
        ...(photoUrl && { instructor_photo_url: photoUrl }),
        ...(cvUrl && { instructor_cv_url: cvUrl }),
        ...(pdfUrl && { syllabus_pdf_url: pdfUrl }),
        updated_at: new Date()
      };

      const { error } = await supabase.from('courses_content').upsert(payload, { onConflict: 'course_key' });

      if (!error) {
        alert('¡Contenido y archivos subidos correctamente a Supabase!');
      } else {
        alert('Error al guardar en la base de datos.');
      }
    } catch (err) {
      console.error(err);
      alert('Error en la carga de archivos.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#09090b] p-6 md:p-10 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-600/20">
            A
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Panel de Administrador</h1>
            <p className="text-xs text-zinc-400">Control total de alumnos y recursos académicos</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut size={16} /> Salir
        </button>
      </div>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveSubTab('students')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'students' ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
          }`}
        >
          <Users size={16} /> Alumnos Inscritos ({students.length})
        </button>
        <button
          onClick={() => setActiveSubTab('cms')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'cms' ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
          }`}
        >
          <UploadCloud size={16} /> Gestión de Contenido & Storage
        </button>
      </div>

      {activeSubTab === 'students' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Listado General de Alumnos</h3>
            <button onClick={fetchStudents} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer">
              <RefreshCw size={14} /> Actualizar
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-500 text-sm">Cargando alumnos...</div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center bg-zinc-900/40 border border-zinc-800 rounded-3xl text-zinc-400 text-sm">
              No hay alumnos inscritos todavía.
            </div>
          ) : (
            <div className="overflow-x-auto border border-zinc-800 rounded-3xl bg-zinc-900/40 shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950/80 text-zinc-400 uppercase font-semibold border-b border-zinc-800">
                  <tr>
                    <th className="p-4">Estudiante</th>
                    <th className="p-4">Curso</th>
                    <th className="p-4">Teléfono</th>
                    <th className="p-4">Pago / Ref</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{st.full_name}</div>
                        <div className="text-zinc-500">{st.age} años • {st.academic_level}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-indigo-400 font-medium">{st.course}</span>
                        {st.premiere_level && (
                          <div className="text-zinc-500 text-[10px]">Pr: {st.premiere_level} | Ae: {st.after_effects_level}</div>
                        )}
                      </td>
                      <td className="p-4 text-zinc-300">{st.phone}</td>
                      <td className="p-4">
                        <div className="text-white font-semibold">${st.total_price}</div>
                        <div className="text-zinc-500">{st.referral ? `Ref: ${st.referral}` : 'Sin referido'}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          st.status === 'Inscrito' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {st.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggleStatus(st.id, st.status)}
                          className={`px-3 py-1.5 rounded-xl font-medium text-[11px] transition-all cursor-pointer ${
                            st.status === 'Preinscrito' 
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20' 
                              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                          }`}
                        >
                          {st.status === 'Preinscrito' ? 'Marcar Inscrito' : 'Volver Preinscrito'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'cms' && (
        <div className="max-w-2xl bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl animate-fadeIn">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Subir Recursos a Supabase Storage</h3>
            <p className="text-xs text-zinc-400 mt-1">Configura la información del instructor y archivos de cada curso.</p>
          </div>

          <form onSubmit={handleCMSUpload} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">Seleccionar Curso a Editar</label>
              <select
                value={courseKey}
                onChange={(e) => setCourseKey(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer"
              >
                <option value="postproduccion">Curso de Postproducción</option>
                <option value="postproduccion-avanzado">Curso de Postproducción Avanzado</option>
                <option value="escritura-creativa">Curso de Escritura Creativa</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">Nombre del Instructor</label>
                <input
                  type="text"
                  required
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  placeholder="Ej. Ana Lucía Silva"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">Foto del Instructor</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                  className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-500 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">Biografía del Instructor (CV breve)</label>
              <textarea
                rows="3"
                required
                value={instructorBio}
                onChange={(e) => setInstructorBio(e.target.value)}
                placeholder="Experiencia, trayectoria y logros..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-xl p-3 text-sm text-white outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">Archivo CV (PDF/Doc)</label>
                <input
                  type="file"
                  onChange={(e) => setCvFile(e.target.files[0])}
                  className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">Pensum del Curso (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {uploading ? 'Subiendo archivos a Supabase...' : <><UploadCloud size={18} /> Guardar Cambios y Subir Archivos</>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}