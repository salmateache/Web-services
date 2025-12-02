import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

// Services
import { authService } from "./services/authService";

// Pages auth
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Layout
import DashboardLayout from "./components/DashboardLayout";

// Pages Communes
import ProfilePage from "./pages/ProfilePage";

// --- PAGES ADMIN ---
import StudentsPage from "./pages/StudentsPage";
import AdminPage from "./pages/AdminPage";
import ProfessorsDashboard from "./pages/ProfessorsDashboard";
import EditProfessor from "./pages/EditProfessor";
import StudentsDashboard from "./pages/StudentsDashboard";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import ModuleList from "./components/modules/ModuleList"; 
import Bulletin from "./components/notes/Bulletin";

// --- PAGES PROFESSEUR (Les imports cruciaux) ---
import ProfesseurPage from "./pages/ProfesseurPage";
import MyModules from "./pages/MyModules";       
import ModuleNotes from "./pages/ModuleNotes";   

interface DecodedToken {
  role: string;
  [key: string]: any;
}

interface ProtectedRouteProps {
  children: ReactNode;
  role: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded: DecodedToken = jwtDecode(token);

    if (role && decoded.role !== role) {
      switch (decoded.role) {
        case "ETUDIANT":
          return <Navigate to="/etudiant" />;
        case "PROFESSEUR":
          return <Navigate to="/professeur" />;
        case "ADMINISTRATEUR":
          return <Navigate to="/admin" />;
        default:
          return <Navigate to="/login" />;
      }
    }

    return <>{children}</>;
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>

        {/* --- AUTH --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* --- PROFIL (Tous) --- */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute role=""> 
              <DashboardLayout role={authService.getCurrentUser()?.role}>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* --- ESPACE ÉTUDIANT --- */}
        <Route
          path="/etudiant"
          element={
            <ProtectedRoute role="ETUDIANT">
              <DashboardLayout role="ETUDIANT">
                <StudentsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* --- ESPACE PROFESSEUR --- */}
        <Route
          path="/professeur"
          element={
            <ProtectedRoute role="PROFESSEUR">
              <DashboardLayout role="PROFESSEUR">
                <ProfesseurPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Route: Liste des modules du prof */}
        <Route 
          path="/professeur/modules" 
          element={
            <ProtectedRoute role="PROFESSEUR">
              <DashboardLayout role="PROFESSEUR">
                <MyModules />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        {/* Route: Saisie des notes (IdModule dynamique) */}
        <Route 
          path="/professeur/modules/:idModule/notes" 
          element={
            <ProtectedRoute role="PROFESSEUR">
              <DashboardLayout role="PROFESSEUR">
                <ModuleNotes />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        {/* --- ESPACE ADMIN --- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMINISTRATEUR">
              <DashboardLayout role="ADMINISTRATEUR">
                <AdminPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin: Gestion Profs */}
        <Route path="/admin/professors" element={<ProtectedRoute role="ADMINISTRATEUR"><DashboardLayout role="ADMINISTRATEUR"><ProfessorsDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/professors/edit/:id" element={<ProtectedRoute role="ADMINISTRATEUR"><DashboardLayout role="ADMINISTRATEUR"><EditProfessor /></DashboardLayout></ProtectedRoute>} />
        
        {/* Admin: Gestion Étudiants */}
        <Route path="/admin/students" element={<ProtectedRoute role="ADMINISTRATEUR"><DashboardLayout role="ADMINISTRATEUR"><StudentsDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/students/add" element={<ProtectedRoute role="ADMINISTRATEUR"><DashboardLayout role="ADMINISTRATEUR"><AddStudent /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/students/edit/:id" element={<ProtectedRoute role="ADMINISTRATEUR"><DashboardLayout role="ADMINISTRATEUR"><EditStudent /></DashboardLayout></ProtectedRoute>} />

        {/* Admin: Gestion Modules & Bulletins */}
        <Route path="/admin/modules" element={<ProtectedRoute role="ADMINISTRATEUR"><DashboardLayout role="ADMINISTRATEUR"><ModuleList /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/bulletin" element={<ProtectedRoute role="ADMINISTRATEUR"><DashboardLayout role="ADMINISTRATEUR"><Bulletin /></DashboardLayout></ProtectedRoute>} />

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
};

export default App;