import React, { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { studentService } from "../services/studentService";
import NoteService from '../services/NoteService'; // Remis à NoteService
import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, Clock, AlertCircle, Loader2, TrendingUp, ArrowRight } from "lucide-react";

export default function StudentPage() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [average, setAverage] = useState<number | null>(null);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      // 1. Trouver les infos complètes de l'étudiant (via username/matricule)
      const results = await studentService.searchStudentsByName(user.username);
      const currentStudent = results[0];

      if (currentStudent) {
        setStudent(currentStudent);

        // 2. Récupérer la moyenne globale (appel au service notes)
        const avgRes = await NoteService.getMoyenne(currentStudent.id);
        
        // ✅ CORRECTION 1 : Accès sécurisé à la moyenne
        // On force 'any' pour l'accès aux données renvoyées par Axios.
        const avgData: any = avgRes.data;
        setAverage(avgData?.moyenne || 0);
      }
    } catch (error) {
      console.error("Erreur chargement student dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  const profiler = student || { nom: "Utilisateur", prenom: "Connecté" };

  return (
    <div className="p-8 bg-gray-50 min-h-full font-sans">
      
      {/* HEADER */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">
          Bonjour, {profiler.prenom +" "+ profiler.nom}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Bienvenue dans votre espace personnel.</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Semestre Actuel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Clock size={32} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">Semestre Actuel</p>
                <h3 className="text-3xl font-bold text-gray-800">S{student?.semestreActuel || 'N/A'}</h3>
            </div>
        </div>

        {/* Filière */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <GraduationCap size={32} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">Filière</p>
                <h3 className="text-xl font-bold text-gray-800">{student?.filiere || 'Non défini'}</h3>
            </div>
        </div>

        {/* Moyenne Générale */}
        <div className
            // ✅ CORRECTION 2 : Vérification directe car average est un number (ou 0) ici
            // J'ai mis 0 si le service renvoie null pour que le composant ne plante pas
            // Note: l'erreur de typage 'average is possibly null' était due à useState<number | null>(null)
            // On gère cette vérification dans le JSX.
            ={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 ${average !== null && average >= 10 ? 'hover:shadow-green' : 'hover:shadow-red'}`}>
            <div className={`p-3 rounded-xl ${average !== null && average >= 10 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                <TrendingUp size={32} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">Moyenne Générale</p>
                <h3 className="text-3xl font-bold text-gray-800">
                    {/* ✅ CORRECTION 2 : Utilisation de l'opérateur ternaire pour le rendu sécurisé */}
                      {average !== null ? `${average.toFixed(2)} / 20` : 'N/A'}
                </h3>
            </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Vos Prochaines Étapes</h3>
        <Link to="/etudiant/modules" className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition">
            <div className="flex items-center gap-3">
                <BookOpen size={24} className="text-blue-600" />
                <span className="font-medium text-blue-800">Consulter mes modules et mes notes</span>
            </div>
            <ArrowRight size={20} className="text-blue-600" />
        </Link>
      </div>

      {/* Rendu des pages vides (étudiant non trouvé) */}
      {!student && !loading && (
          <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
             <AlertCircle size={20} className="mr-2" />
             Votre profil détaillé n'a pas pu être trouvé dans la base de données.
          </div>
      )}
    </div>
  );
}