import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";

// Importez vos pages ici
import StudentsPage from "./pages/StudentsPage";
// import AddStudent from "./pages/AddStudent"; // Décommentez quand vous avez créé ce fichier

const App: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        {/* Route par défaut (/) affiche la liste des étudiants */}
        <Route path="/" element={<StudentsPage />} />
        
        {/* Route dashboard (si différente) */}
        <Route path="/dashboard" element={<StudentsPage />} />
        
        {/* Route pour ajouter un étudiant */}
        {/* <Route path="/add-student" element={<AddStudent />} /> */}
      </Routes>
    </DashboardLayout>
  );
};

export default App;
