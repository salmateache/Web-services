import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, LayoutDashboard, Menu, Bell,
  BookOpen, FileText, User, LogOut, ChevronDown,
  MessageSquare
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: string;
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // ✅ confirmation modal
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getMenuItems = (role?: string) => {
    switch (role) {
      case "ADMINISTRATEUR":
        return [
          { icon: LayoutDashboard, label: "Dashboard Admin", route: "/admin" },
          { icon: Users, label: "Gérer Professeurs", route: "/admin/professors" },
          { icon: Users, label: "Gérer Etudiants", route: "/admin/students" },
          { icon: BookOpen, label: "Gérer Modules", route: "/admin/modules" },
          { icon: FileText, label: "Relevés de notes", route: "/admin/bulletin" },
        ];
      case "PROFESSEUR":
        return [
          { icon: LayoutDashboard, label: "Tableau de Bord", route: "/professeur" },
          { icon: BookOpen, label: "Mes Modules & Notes", route: "/professeur/modules" },
          { icon: FileText, label: "Gérer les Réclamations", route: "/professeur/reclamations" }, // 👈 NOUVEAU
        ];
     case "ETUDIANT":
        return [
          { icon: LayoutDashboard, label: "Mon Espace", route: "/etudiant" },
          { icon: BookOpen, label: "Mes Modules & Notes", route: "/etudiant/modules" },
          { icon: MessageSquare, label: "Mes Réclamations", route: "/etudiant/reclamations" }, // 👈 NOUVEAU LIEN
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems(role);
  const currentUser = authService.getCurrentUser();

  // ✅ fonction de déconnexion avec confirmation
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    authService.logout();
  };

  const cancelLogout = () => setShowLogoutConfirm(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* SIDEBAR */}
      <aside className={`bg-white text-gray-800 border-r border-gray-200 transition-all duration-300 flex flex-col
          ${isSidebarOpen ? 'w-64' : 'w-20'} fixed h-full z-20 left-0 top-0 hidden md:flex`}>
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <div className={`font-bold text-2xl text-blue-600 transition-all duration-300 ${!isSidebarOpen && 'scale-0'}`}>
            {isSidebarOpen ? 'EduTrack' : 'EM'}
          </div>
          {!isSidebarOpen && <div className="absolute font-bold text-xl text-blue-600">EM</div>}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.route;
            return (
              <button
                key={index}
                onClick={() => navigate(item.route)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
                  }`}
              >
                <item.icon size={22} className={`transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}`} />
                <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>

        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
              {role === "ADMINISTRATEUR" ? "Administration" : `Espace ${role ? role.charAt(0) + role.slice(1).toLowerCase() : 'Utilisateur'}`}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* MENU PROFIL */}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-2 focus:outline-none">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md cursor-pointer hover:shadow-lg transition">
                  {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">{currentUser?.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{role?.toLowerCase()}</p>
                  </div>

                  <button 
                      onClick={() => { setIsProfileMenuOpen(false); navigate('/profile'); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                  >
                      <User size={16} /> Mon Profil
                  </button>

                  <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition border-t border-gray-100"
                  >
                      <LogOut size={16} /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* ✅ MODAL DE CONFIRMATION */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-lg flex flex-col items-center">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Confirmer la déconnexion</h2>
            <p className="text-gray-600 mb-6 text-center">Voulez-vous vraiment vous déconnecter ?</p>
            <div className="flex gap-4">
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Oui
              </button>
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
