import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import ProfessorsDashboard from "./pages/ProfessorsDashboard";
import AddProfessor from "./pages/AddProfessor"; // 1. Import de la nouvelle page

const App: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        {/* Route par défaut : Tableau de bord */}
        <Route path="/" element={<ProfessorsDashboard />} />
        
        {/* 2. Nouvelle route pour le formulaire d'ajout */}
        <Route path="/add-professor" element={<AddProfessor />} />
      </Routes>
    </DashboardLayout>
  );
};

export default App;