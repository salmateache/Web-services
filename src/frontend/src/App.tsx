// Fichier : frontend/src/App.tsx
import { Routes, Route } from "react-router-dom"; // SANS BrowserRouter
import ProfessorsDashboard from "./pages/ProfessorsDashboard";
import AddProfessor from "./pages/AddProfessor";
import EditProfessor from "./pages/EditProfessor"; 
import DashboardLayout from "./components/DashboardLayout"; 

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<ProfessorsDashboard />} />
        <Route path="/professors/add" element={<AddProfessor />} />
        <Route path="/professors/edit/:id" element={<EditProfessor />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;