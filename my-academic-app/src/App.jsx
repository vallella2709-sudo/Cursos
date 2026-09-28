import React, { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import StudentPortal from './components/StudentPortal';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [role, setRole] = useState(null); // 'student' | 'admin' | null

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      <main className="flex-1 flex flex-col">
        {!role && <RoleSelector onSelectRole={setRole} />}
        {role === 'student' && <StudentPortal onBack={() => setRole(null)} />}
        {role === 'admin' && <AdminPanel onBack={() => setRole(null)} />}
      </main>
      
      <footer className="py-6 text-center text-xs text-zinc-600 border-t border-zinc-900">
        Plataforma Académica • Diseñado con enfoque minimalista &bull; {new Date().getFullYear()}
      </footer>
    </div>
  );
}