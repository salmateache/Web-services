import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { studentService } from "../services/studentService";
import ModuleService from "../services/ModuleService";
import NoteService from "../services/NoteService";
import { professorService } from "../services/professorService";
import {
  ArrowLeft, Loader2, Save, User, FileText, CheckCircle, XCircle,
  Calendar, AlertTriangle, MessageSquare
} from "lucide-react";

export default function ModuleDetails() {
  const { idModule } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState<any>(null);
  const [professor, setProfessor] = useState<any>(null);
  const [note, setNote] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [reclamationText, setReclamationText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [idModule]);

  const loadData = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) return;

      // Load student info
      const studentResults = await studentService.searchStudentsByName(user.username);
      const currentStudent = studentResults[0];
      if (!currentStudent) return;
      setStudent(currentStudent);

      // Load module, notes, professors
      const [modRes, notesRes, profsRes] = await Promise.all([
        ModuleService.getModuleById(Number(idModule)),
        NoteService.getNotesByEtudiant(currentStudent.id),
        professorService.getAllProfessors()
      ]);

      const currentModule = modRes.data;
      setModule(currentModule);

      // Build professor map
      const profMap: Record<number, any> = {};
      (profsRes.data || []).forEach((p: any) => {
        profMap[p.id] = p;
      });



      // Retrieve note for student
      const studentNotes = notesRes.data || [];
      const specificNote = studentNotes.find((n: any) =>
        (n.idModule || n.id_module) === currentModule.id_module
      );
      setNote(specificNote);

    } catch (error) {
      console.error("Erreur chargement détails du module", error);
    } finally {
      setLoading(false);
    }
  };

  // ---- RECLAMATION ----
  const handleSubmitReclamation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reclamationText.length < 20) {
      alert("Votre réclamation doit contenir au moins 20 caractères.");
      return;
    }
    if (!student || !module) {
      alert("Erreur: données manquantes.");
      return;
    }

    setIsSubmitting(true);

    try {
      await NoteService.submitReclamation({
        idEtudiant: student.id,
        idModule: Number(idModule),
        motif: reclamationText
      });

      alert(`Réclamation soumise avec succès.`);
      setReclamationText('');

    } catch (error) {
      alert("Erreur serveur pendant la soumission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  if (!module)
    return (
      <div className="p-10 text-red-600">Module non trouvé.</div>
    );

  const noteValue = note?.valeur != null ? parseFloat(note.valeur) : null;
  const isValide = noteValue !== null && noteValue >= 10;

  const professorName = professor
    ? `${professor.prenom} ${professor.nom}`.toUpperCase()
    : "Aucun professeur assigné";

  const noteStatus =
    noteValue === null ? "N/A" : (isValide ? "Validé" : "Non Validé");

  const noteColor =
    noteValue === null ? 'text-gray-400'
      : (isValide ? 'text-emerald-600' : 'text-red-600');

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <div className="mb-8">
        <button
          onClick={() => navigate('/etudiant/modules')}
          className="flex items-center text-gray-500 hover:text-gray-800 mb-2 transition"
        >
          <ArrowLeft size={18} className="mr-1" /> Retour à la liste des modules
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{module.nom_module}</h1>
        <p className="text-gray-500 mt-1">Détails du module et statut de votre note.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ---- STATUT NOTE ---- */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border p-6 flex flex-col items-center text-center">

          <div className={`p-4 rounded-full ${isValide ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {isValide
              ? <CheckCircle size={40} className="text-emerald-600" />
              : <XCircle size={40} className="text-red-600" />}
          </div>

          <h2 className={`text-5xl font-extrabold mt-4 ${noteColor}`}>
            {noteValue !== null ? noteValue.toFixed(2) : '--'} / 20
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Session : {note?.session || 'N/A'}
          </p>

          <div className="mt-6 pt-4 border-t w-full">
            <p className="text-sm font-semibold text-gray-600">Statut du Module</p>
            <span className={`mt-1 font-bold inline-block px-3 py-1 rounded-full text-sm ${isValide ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {noteStatus}
            </span>
          </div>
        </div>

        {/* ---- DETAILS + RÉCLAMATION ---- */}
        <div className="lg:col-span-2 space-y-8">

          {/* ---- DETAILS ---- */}
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
              Informations du Cours
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">

              <div className="font-medium text-gray-600">Code du Module:</div>
              <div className="text-gray-800 font-mono">{module.code_module}</div>

              <div className="font-medium text-gray-600">Coefficient:</div>
              <div className="text-gray-800 font-medium">{module.coefficient}</div>

              <div className="font-medium text-gray-600 flex items-center gap-1">
                <Calendar size={14} /> Semestre:
              </div>
              <div className="text-gray-800 font-medium">S{module.semestre}</div>
            </div>
          </div>

          {/* ---- RÉCLAMATION ---- */}
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-600" /> Soumettre une Réclamation
            </h3>

            <form onSubmit={handleSubmitReclamation} className="space-y-4">
              <p className="text-sm text-gray-500 mb-4 flex items-start gap-2">
                <AlertTriangle size={18} className="text-yellow-600 mt-0.5 shrink-0" />
                Votre demande sera soumise au service administratif.
              </p>

              <textarea
                value={reclamationText}
                onChange={(e) => setReclamationText(e.target.value)}
                rows={4}
                placeholder="Expliquez clairement la raison de votre réclamation..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                required
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || noteValue === null}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting
                    ? <Loader2 size={20} className="animate-spin" />
                    : <Save size={20} />}
                  Envoyer la Demande
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
