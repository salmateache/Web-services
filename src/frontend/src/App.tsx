import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AddStudent from "./pages/AddStudent";
import StudentsPage from "./pages/StudentsPage";

const App: React.FC = () => {
  return (
    <div className="p-4">
      <nav className="mb-4">
        <Link className="mr-4" to="/">Étudiants</Link>
        <Link to="/add-student">Ajouter étudiant</Link>
      </nav>

      <Routes>
        <Route path="/" element={<StudentsPage />} />
        <Route path="/add-student" element={<AddStudent />} />
      </Routes>
    </div>
  );
};

export default App;
