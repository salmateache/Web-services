import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  LayoutDashboard, 
  UserPlus, 
  LogOut, 
  Menu, 
  Bell 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation(); // Pour savoir sur quelle page on est

  // Configuration du menu
  const menuItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard" },
    { icon: Users, label: "Liste Étudiants", path: "/" },
    { icon: UserPlus, label: "Ajouter Étudiant", path: "/add-student" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* --- SIDEBAR (Barre latérale) --- */}
      <aside 
        className={`bg-white text-gray-800 border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          fixed h-full z-20 left-0 top-0 hidden md:flex`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <div className={`font-bold text-2xl text-blue-600 transition-all ${!isSidebarOpen && 'scale-0'}`}>
            {isSidebarOpen ? 'EduManager' : 'EM'}
          </div>
        </div>

        {/* Liens de navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <item.icon size={22} className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} />
                
                {/* Texte du lien (caché si menu fermé) */}
                <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100 ml-3' : 'w-0 opacity-0'}`}>
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bouton Déconnexion */}
        <div className="p-3 border-t border-gray-100">
          <button className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 rounded-xl transition">
            <LogOut size={22} />
            <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100 ml-3' : 'w-0 opacity-0'}`}>
              <span className="font-medium whitespace-nowrap">Déconnexion</span>
            </div>
          </button>
        </div>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        
        {/* HEADER (Barre du haut) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Gestion Scolaire</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-9 w-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Injection de la page (StudentsPage, AddStudent, etc.) */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
