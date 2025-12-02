import React, { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { professorService } from "../services/professorService";
import ModuleService from "../services/ModuleService";
import NoteService from "../services/NoteService";
import { 
  BookOpen, Users, TrendingUp, Award, Loader2, Calendar, CheckCircle 
} from "lucide-react";
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

export default function ProfesseurPage() {
  const [loading, setLoading] = useState(true);
  const [profName, setProfName] = useState("");
  const [stats, setStats] = useState({
    nbModules: 0,
    nbStudents: 0,
    successRate: [] as any[],
    avgNote: 0
  });

  useEffect(() => {
    loadProfData();
  }, []);

  const normalizeModule = (m: any) => ({
    idModule: m.idModule ?? m.id_module ?? m.id,
    idProf: m.idProfesseur ?? m.id_prof ?? m.profId,
    ...m
  });

  const normalizeNote = (n: any) => ({
    idModule: n.idModule ?? n.id_module,
    idEtudiant: n.idEtudiant ?? n.id_etudiant,
    valeur: n.valeur,
    ...n
  });

  const loadProfData = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      // 1) Professeur connecté
      const profs = await professorService.getAllProfessors();
      const currentProf = profs.find((p: any) =>
        p.email === user.username ||
        p.nom?.toLowerCase() === user.username.toLowerCase() ||
        p.prenom?.toLowerCase() === user.username.toLowerCase()
      );

      if (!currentProf) {
        setProfName("Professeur non associé");
        return;
      }

      setProfName(`${currentProf.prenom} ${currentProf.nom}`);

      // 2) Modules
      const moduleRes = await ModuleService.getAllModules();
      let modules = moduleRes.data;

      if (!Array.isArray(modules)) {
        modules = modules.content || [];
      }

      const normalizedModules = modules.map(normalizeModule);

      // Modules de CE professeur
      const myModules = normalizedModules.filter(
        (m) => m.idProf === currentProf.id
      );

      // 3) Notes
      const noteRes = await NoteService.getAllNotes();
      const normalizedNotes = noteRes.data.map(normalizeNote);

      // Notes liées aux modules du prof
      const myNotes = normalizedNotes.filter((n) =>
        myModules.some((m) => m.idModule === n.idModule)
      );

      // 4) Statistiques
      const total = myNotes.length;
      const valid = myNotes.filter((n) => n.valeur >= 10).length;
      const nonValid = total - valid;

      const avg =
        total > 0
          ? (myNotes.reduce((sum, n) => sum + n.valeur, 0) / total).toFixed(2)
          : 0;

      setStats({
        nbModules: myModules.length,
        nbStudents: total,
        avgNote: Number(avg),
        successRate: [
          { name: "Validés", value: valid },
          { name: "Non Validés", value: nonValid }
        ]
      });
    } catch (err) {
      console.error("Erreur dashboard professeur :", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-full font-sans">
      
      {/* HEADER */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Bonjour, Pr. {profName} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Voici un aperçu de vos activités pédagogiques.
          </p>
        </div>
        <div className="hidden md:flex bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium items-center gap-2">
          <Calendar size={18} />
          Année Univ. 2024-2025
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Modules */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <BookOpen size={32} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Modules Enseignés</p>
            <h3 className="text-3xl font-bold">{stats.nbModules}</h3>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Users size={32} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Notes Attribuées</p>
            <h3 className="text-3xl font-bold">{stats.nbStudents}</h3>
          </div>
        </div>

        {/* Moyenne */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition flex items-center gap-4">
          <div
            className={`p-3 rounded-xl ${
              stats.avgNote >= 10
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Moyenne Générale</p>
            <h3 className="text-3xl font-bold">{stats.avgNote} / 20</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Taux de Réussite
          </h3>

          <div className="h-64 flex items-center justify-center">
            {stats.nbStudents > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.successRate}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.successRate.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 italic">
                Aucune note disponible.
              </p>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg">
          <div>
            <div className="bg-white/10 w-fit p-2 rounded-lg mb-4">
              <Award size={24} className="text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Espace Enseignant</h3>
            <p className="text-slate-300 text-sm">
              Gérez vos modules, consultez vos étudiants et saisissez les notes.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>Saisie sécurisée</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>Export PDF automatique</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
