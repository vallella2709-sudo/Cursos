import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';
import { CheckCircle2, Send, AlertCircle, Clock, UserCheck, ChevronRight } from 'lucide-react';

export default function StudentRegister({ userInscribed, myEnrollments, onSuccess, onViewInfo }) {
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    academic_level: 'Universitario',
    phone: '',
    course: 'Curso de Postproducción',
    premiere_level: 'Básico',
    after_effects_level: 'Básico',
    motivation: '',
    referral: ''
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(false);

  const isPostProduction = formData.course.includes('Postproducción');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const hasReferral = formData.referral.trim().length > 0;
    const totalPrice = hasReferral ? 8 : 10;

    const payload = {
      ...formData,
      age: parseInt(formData.age),
      total_price: totalPrice,
      status: 'Preinscrito',
      premiere_level: isPostProduction ? formData.premiere_level : null,
      after_effects_level: isPostProduction ? formData.after_effects_level : null,
      motivation: isPostProduction ? formData.motivation : null,
    };

    const { error } = await supabase.from('students').insert([payload]);

    setLoading(false);
    if (!error) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      setSuccessData(true);
      onSuccess(formData.phone);
    } else {
      alert('Hubo un error al registrar. Inténtalo de nuevo.');
    }
  };

  if (userInscribed && !successData) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
              <UserCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Seguimiento de Estado</h2>
              <p className="text-xs text-zinc-400">Tus inscripciones registradas en el sistema</p>
            </div>
          </div>

          <div className="space-y-4">
            {myEnrollments.map((item) => (
              <div key={item.id} className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">{item.course}</span>
                  <h4 className="text-base font-bold text-white mt-0.5">{item.full_name}</h4>
                  <p className="text-xs text-zinc-500 mt-1">Teléfono: {item.phone} • Pago: ${item.total_price}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                    item.status === 'Inscrito' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    <Clock size={12} /> {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
            <p className="text-xs text-indigo-200">¿Deseas consultar detalles de instructores o pensum?</p>
            <button 
              onClick={onViewInfo}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              Ver más info <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (successData) {
    return (
      <div className="max-w-xl mx-auto text-center bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl animate-fadeIn">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-xl">
          <CheckCircle2 size={40} />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
          ¡Felicidades has sido preinscrito!
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed mb-6">
          Estamos confirmando tu pago. Una vez confirmado se enviará un mensaje de texto confirmando el proceso de inscripción y la fecha del curso: <strong className="text-indigo-400">sábado 3 de octubre de 1pm a 5pm</strong>.
        </p>

        <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-2xl text-xs text-zinc-400 space-y-2 mb-8 text-left">
          <p className="flex items-center gap-2 text-amber-400 font-medium">
            <AlertCircle size={15} /> Nota Importante:
          </p>
          <p>Es obligatorio traer tu laptop con los programas instalados.</p>
          <p>Dudas al grupo de WhatsApp o al <strong className="text-zinc-200">04142545533</strong>.</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-2xl transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl animate-fadeIn">
      <div className="mb-8">
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Formulario Oficial</span>
        <h2 className="text-2xl font-bold text-white mt-1">Inscripción al Curso</h2>
        <p className="text-xs text-zinc-400 mt-1">Costo base: $10 (O $8 si vienes recomendado).</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">Nombre y Apellido</label>
            <input
              type="text"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Ej. Carlos Mendoza"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">Edad</label>
            <input
              type="number"
              name="age"
              required
              min="10"
              max="100"
              value={formData.age}
              onChange={handleChange}
              placeholder="Ej. 22"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">Nivel Académico</label>
            <select
              name="academic_level"
              value={formData.academic_level}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all cursor-pointer"
            >
              <option value="Bachiller">Bachiller</option>
              <option value="Universitario">Universitario</option>
              <option value="Tsu">T.S.U.</option>
              <option value="Profesional">Profesional</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">Número de Teléfono</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ej. 04141234567"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-2">Curso al que deseas inscribirte</label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all cursor-pointer"
          >
            <option value="Curso de Postproducción">Curso de Postproducción</option>
            <option value="Curso de Postproducción Avanzado">Curso de Postproducción Avanzado</option>
            <option value="Curso de Escritura Creativa">Curso de Escritura Creativa</option>
          </select>
        </div>

        {isPostProduction && (
          <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl space-y-4 animate-fadeIn">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Configuración de Postproducción</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Nivel Premiere Pro</label>
                <select
                  name="premiere_level"
                  value={formData.premiere_level}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                >
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Nivel After Effects</label>
                <select
                  name="after_effects_level"
                  value={formData.after_effects_level}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                >
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">¿Para qué quieres realizar este curso?</label>
              <textarea
                name="motivation"
                rows="2"
                value={formData.motivation}
                onChange={handleChange}
                placeholder="Breve descripción de tus metas..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-sm text-white outline-none resize-none"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-2">
            ¿Tienes algún referido? <span className="text-indigo-400 font-normal">(Descuenta el precio a $8)</span>
          </label>
          <input
            type="text"
            name="referral"
            value={formData.referral}
            onChange={handleChange}
            placeholder="Nombre de quien te recomendó (o déjalo vacío)"
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
          <div>
            <span className="text-xs text-zinc-400">Total a Pagar:</span>
            <p className="text-2xl font-extrabold text-white">
              ${formData.referral.trim().length > 0 ? '8' : '10'} <span className="text-xs font-normal text-zinc-500">USD</span>
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Procesando...' : <>Enviar Inscripción <Send size={16} /></> }
          </button>
        </div>
      </form>
    </div>
  );
}