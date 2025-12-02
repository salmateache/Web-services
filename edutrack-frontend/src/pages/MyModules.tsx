import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/authService";
import { professorService } from "../services/professorService";
import ModuleService from "../services/ModuleService";
import { Loader2, BookOpen, GraduationCap, Edit, Calendar } from "lucide-react";

export default function MyModules() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profName, setProfName] = useState("");

  useEffect(() => {
    loadMyModules();
  }, []);

  const loadMyModules = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      // 1. Identifier le professeur connecté
      const allProfs = await professorService.getAllProfessors();
      const currentProf = allProfs.find((p: any) => 
        (p.email && p.email === user.username) || 
        (p.nom && p.nom.toLowerCase() === user.username.toLowerCase()) ||
        (p.prenom && p.prenom.toLowerCase() === user.username.toLowerCase())
      );

      if (currentProf) {
        setProfName(`${currentProf.prenom} ${currentProf.nom}`);

        // 2. Récupérer tous les modules
        const allModulesRes = await ModuleService.getAllModules();
        
        // Gestion robuste du format de réponse (Tableau ou Page)
        const modulesData = allModulesRes.data as any;
        const allModules = Array.isArray(modulesData) ? modulesData : (modulesData.content || []);
        
        // 3. Filtrer uniquement ceux assignés à ce professeur
        const myModules = allModules.filter((m: any) => m.id_prof === currentProf.id);
        
        // Tri par semestre pour l'affichage
        myModules.sort((a: any, b: any) => a.semestre - b.semestre);

        setModules(myModules);
      }
    } catch (error) {
      console.error("Erreur chargement modules prof", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="p-8 bg-gray-50 min-h-full font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <BookOpen className="text-blue-600" size={32} /> 
          Mes Modules d'Enseignement
        </h1>
        <p className="text-gray-500 mt-1 ml-11">
          Sélectionnez un module pour gérer les notes et consulter la liste des étudiants.
        </p>
      </div>

      {modules.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-200">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <BookOpen size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Aucun module assigné</h3>
            <p className="text-gray-500 mt-2">Vous n'avez pas encore de cours affectés pour cette année.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
                <div key={module.id_module} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition">
                            <GraduationCap size={28} />
                        </div>
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Calendar size={12} /> Semestre {module.semestre}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition">
                        {module.nom_module}
                    </h3>
                    <p className="text-sm text-gray-400 font-mono mb-6">
                        CODE: {module.code_module} • COEF: {module.coefficient}
                    </p>
                    <Link 
                        to={`/professeur/modules/${module.id_module}/notes`} 
                        className="block w-full"
                    >
                        <button className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-2.5 rounded-xl font-medium transition flex items-center justify-center gap-2">
                            <Edit size={18} /> Saisir les notes
                        </button>
                    </Link>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}