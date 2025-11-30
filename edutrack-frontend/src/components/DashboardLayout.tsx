// src/components/DashboardLayout.tsx
import React, { useState } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: string;
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const getMenuItems = (role?: string) => {
    switch (role) {
      case "ADMINISTRATEUR":
        return [
          { icon: LayoutDashboard, label: "Dashboard Admin", route: "/admin" },
          { icon: Users, label: "Gérer Professeurs", route: "/admin/professors" },
          { icon: Users, label: "Gérer Etudiants", route: "/admin/students" },
        ];
      case "PROFESSEUR":
        return [
          { icon: LayoutDashboard, label: "Espace Prof", route: "/professeur" },
        ];
      case "ETUDIANT":
        return [
          { icon: LayoutDashboard, label: "Mon Espace", route: "/etudiant" },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems(role);

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside 
        className={`bg-white text-gray-800 border-r border-gray-200 transition-all duration-300 flex flex-col
          ${isSidebarOpen ? 'w-64' : 'w-20'} fixed h-full z-20 left-0 top-0 hidden md:flex`}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <div className="font-bold text-2xl text-blue-600">
            {isSidebarOpen ? 'EduTrack' : 'EM'}
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.route)}
              className="w-full flex items-center p-3 rounded-xl transition-colors duration-200
                text-gray-500 hover:bg-blue-50 hover:text-blue-600"
            >
              <item.icon size={22} />
              {isSidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 rounded-xl transition"
          >
            <LogOut size={22} />
            {isSidebarOpen && <span className="ml-3 font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Espace {role ? role.charAt(0) + role.slice(1).toLowerCase() : 'Utilisateur'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-9 w-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
              {role?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirmer la déconnexion</h2>
            <p className="text-gray-600 mb-6">Voulez-vous vraiment vous déconnecter ?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >Annuler</button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >Déconnexion</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
