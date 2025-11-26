import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  LogOut, 
  Menu, 
  Bell,
  GraduationCap,
  UserPlus 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Configuration du menu
  const menuItems = [
    { icon: Users, label: "Liste des Professeurs", path: "/" }, 
    { icon: UserPlus, label: "Ajouter Professeur", path: "/professors/add" }, 
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row font-sans text-gray-800">
      
      {/* --- 1. SIDEBAR (Barre latérale FIXE) --- */}
      <aside 
        // 🚨 SYNTAXE CORRIGÉE 🚨
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          fixed h-full z-20 left-0 top-0 hidden md:flex flex-col justify-between shadow-sm`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <div className="flex items-center gap-2 font-bold text-xl text-emerald-600 transition-all">
            <GraduationCap size={28} />
            <span className={`${!isSidebarOpen ? 'hidden' : ''}`}>ProfManager</span>
          </div>
        </div>

        {/* Liens de navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/'); 
            return (
              <Link
                key={index}
                to={item.path}
                // 🚨 SYNTAXE CORRIGÉE 🚨
                className={`flex items-center p-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-emerald-50 text-emerald-600 font-semibold' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <item.icon size={22} className={isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"} />
                
                <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100 ml-3' : 'w-0 opacity-0'}`}>
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bouton Déconnexion */}
        <div className="p-3 border-t border-gray-100 mt-auto"> 
          <button className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 rounded-xl transition">
            <LogOut size={22} />
            <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100 ml-3' : 'w-0 opacity-0'}`}>
              <span className="font-medium whitespace-nowrap">Déconnexion</span>
            </div>
          </button>
        </div>
      </aside>

      {/* COMPENSATEUR : Placeholder pour l'espace vide créé par la Sidebar fixe. */}
      <div 
        className={`hidden md:block transition-all duration-300 ease-in-out flex-shrink-0 
          ${isSidebarOpen ? 'w-64' : 'w-20'}`} 
      >
        {/* Reste vide */}
      </div>

      {/* --- 2. CONTENU PRINCIPAL --- */}
      <div className="flex-1 flex flex-col transition-all duration-300"> 
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Espace Professeurs</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-9 w-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
              PR
            </div>
          </div>
        </header>

        {/* Injection de la page */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}