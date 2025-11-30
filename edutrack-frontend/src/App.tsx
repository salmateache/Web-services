// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

// Pages auth
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Layout
import DashboardLayout from "./components/DashboardLayout";

// Pages Etudiant / Professeur / Admin
import StudentsPage from "./pages/StudentsPage";
import AdminPage from "./pages/AdminPage";
import ProfesseurPage from "./pages/ProfesseurPage";

// Pages Professeurs (Admin)
import ProfessorsDashboard from "./pages/ProfessorsDashboard";
import EditProfessor from "./pages/EditProfessor";

// 📌 Pages Students (Admin) — AJOUTÉES
import StudentsDashboard from "./pages/StudentsDashboard";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";

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

        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ======================= ETUDIANT ======================= */}
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

        {/* ======================= PROFESSEUR ======================= */}
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

        {/* ======================= ADMIN ======================= */}
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

        {/* ADMIN -> PROFESSEURS */}
        <Route
          path="/admin/professors"
          element={
            <ProtectedRoute role="ADMINISTRATEUR">
              <DashboardLayout role="ADMINISTRATEUR">
                <ProfessorsDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/professors/edit/:id"
          element={
            <ProtectedRoute role="ADMINISTRATEUR">
              <DashboardLayout role="ADMINISTRATEUR">
                <EditProfessor />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ======================= ADMIN -> STUDENTS (AJOUTÉ) ======================= */}

        {/* Liste des étudiants */}
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute role="ADMINISTRATEUR">
              <DashboardLayout role="ADMINISTRATEUR">
                <StudentsDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Ajouter un étudiant */}
        <Route
          path="/admin/students/add"
          element={
            <ProtectedRoute role="ADMINISTRATEUR">
              <DashboardLayout role="ADMINISTRATEUR">
                <AddStudent />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Modifier un étudiant */}
        <Route
          path="/admin/students/edit/:id"
          element={
            <ProtectedRoute role="ADMINISTRATEUR">
              <DashboardLayout role="ADMINISTRATEUR">
                <EditStudent />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
};

export default App;
