import React, { useState, useEffect } from 'react';
import { Home, FileText, Info, LogOut, Menu, X } from 'lucide-react';
import StudentHome from './StudentHome';
import StudentRegister from './StudentRegister';
import StudentInfo from './StudentInfo';
import { supabase } from '../lib/supabase';

export default function StudentPortal({ onBack }) {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userInscribed, setUserInscribed] = useState(false);
  const [myEnrollments, setMyEnrollments] = useState([]);

  useEffect(() => {
    checkLocalEnrollment();
  }, []);

  const checkLocalEnrollment = async () => {
    const savedPhone = localStorage.getItem('student_phone');
    if (savedPhone) {
      setUserInscribed(true);
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('phone', savedPhone);
      if (data) setMyEnrollments(data);
    }
  };

  const handleSuccessfulEnrollment = (phone) => {
    localStorage.setItem('student_phone', phone);
    setUserInscribed(true);
    checkLocalEnrollment();
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'register', label: userInscribed ? 'Mis Cursos / Estado' : 'Inscribirse', icon: FileText },
    { id: 'info', label: 'Más Información', icon: Info },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-[#09090b]">
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md p-6 justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
              E
            </div>
            <span className="font-bold tracking-tight text-white text-lg">Estudiantes</span>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon size={18} />
                  {item.id === 'register' && userInscribed ? 'Mi Estado' : item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut size={18} /> Cambiar de Rol
        </button>
      </aside>

      <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
            E
          </div>
          <span className="font-bold text-white">Estudiantes</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-zinc-950/95 backdrop-blur-2xl z-40 p-6 flex flex-col justify-between animate-fadeIn">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-medium text-base transition-all ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-zinc-900'
                  }`}
                >
                  <Icon size={20} />
                  {item.id === 'register' && userInscribed ? 'Mi Estado' : item.label}
                </button>
              );
            })}
          </nav>
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-medium text-sm text-red-400 bg-red-500/10"
          >
            <LogOut size={18} /> Cambiar de Rol
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-5xl mx-auto w-full">
        {activeTab === 'home' && <StudentHome onNavigateToRegister={() => setActiveTab('register')} />}
        {activeTab === 'register' && (
          <StudentRegister 
            userInscribed={userInscribed} 
            myEnrollments={myEnrollments}
            onSuccess={handleSuccessfulEnrollment} 
            onViewInfo={() => setActiveTab('info')}
          />
        )}
        {activeTab === 'info' && <StudentInfo />}
      </main>
    </div>
  );
}