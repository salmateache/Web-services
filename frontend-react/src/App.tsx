import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react"; 
import { jwtDecode } from "jwt-decode";

// Import des pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardLayout from "./components/DashboardLayout";
import StudentsPage from "./pages/StudentsPage";
import AdminPage from "./pages/AdminPage";
import ProfesseurPage from "./pages/ProfesseurPage";

interface DecodedToken {
  role: string;
  [key: string]: any;
}

interface ProtectedRouteProps {
  children: ReactNode;
  role: string;
}

// Composant pour protéger les routes selon le rôle
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    if (role && decoded.role !== role) {
      // Si le rôle ne correspond pas, on redirige vers la bonne page
      switch (decoded.role) {
        case "ETUDIANT": return <Navigate to="/etudiant" />;
        case "PROFESSEUR": return <Navigate to="/professeur" />;
        case "ADMINISTRATEUR": return <Navigate to="/admin" />;
        default: return <Navigate to="/login" />;
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
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* --- ROUTES PROTÉGÉES --- */}
        
        {/* 1. Route Étudiant */}
        <Route
          path="/etudiant"
          element={
            <ProtectedRoute role="ETUDIANT">
              {/* ICI : On dit au Layout que c'est un ETUDIANT pour afficher le bon menu */}
              <DashboardLayout role="ETUDIANT">
                <StudentsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* 2. Route Professeur */}
        <Route
          path="/professeur"
          element={
            <ProtectedRoute role="PROFESSEUR">
              {/* ICI : On dit au Layout que c'est un PROFESSEUR */}
              <DashboardLayout role="PROFESSEUR">
                <ProfesseurPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* 3. Route Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMINISTRATEUR">
              {/* ICI : On dit au Layout que c'est un ADMIN */}
              <DashboardLayout role="ADMINISTRATEUR">
                <AdminPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;