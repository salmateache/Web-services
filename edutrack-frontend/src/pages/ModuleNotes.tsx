import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModuleService from '../services/ModuleService';
import NoteService from '../services/NoteService';
import { studentService } from '../services/studentService';
import { ArrowLeft, Save, Loader2, CheckCircle } from 'lucide-react';

export default function ModuleNotes() {
  const { idModule } = useParams();
  const navigate = useNavigate();
  
  const [module, setModule] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [notes, setNotes] = useState<Record<number, { valeur: string, session: string, id_note?: number }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [idModule]);

  const loadData = async () => {
    try {
      if (!idModule) return;

      // 1. Récupérer les infos du module
      const modRes = await ModuleService.getModuleById(Number(idModule));
      const currentModule = modRes.data;
      setModule(currentModule);

      // 2. Récupérer les étudiants et FILTRER correctement (Gestion camelCase/snake_case)
      const allStudents = await studentService.getAllStudents();
      
      const enrolledStudents = allStudents.filter((s: any) => {
        // On vérifie les deux écritures possibles venant du backend
        const etudSemestre = s.semestreActuel || s.semestre_actuel;
        // On convertit en Number pour comparer (ex: "1" == 1)
        return Number(etudSemestre) === Number(currentModule.semestre);
      });
      
      setStudents(enrolledStudents);

      // 3. Récupérer les notes existantes
      const notesRes = await NoteService.getNotesByModule(Number(idModule));
      
      const notesMap: any = {};
      
      if (Array.isArray(notesRes.data)) {
        notesRes.data.forEach((n: any) => {
            // Gestion des variantes de nommage ID (idEtudiant vs id_etudiant)
            const etudiantId = n.idEtudiant || n.id_etudiant;
            const noteId = n.id || n.id_note;

            if (etudiantId) {
                notesMap[etudiantId] = {
                    valeur: n.valeur.toString(),
                    session: n.session,
                    id_note: noteId 
                };
            }
        });
      }
      setNotes(notesMap);

    } catch (error) {
      console.error("Erreur chargement notes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteChange = (idEtudiant: number, field: 'valeur' | 'session', value: string) => {
    setNotes(prev => ({
        ...prev,
        [idEtudiant]: {
            ...prev[idEtudiant],
            [field]: value,
            session: prev[idEtudiant]?.session || 'normal'
        }
    }));
  };

  const saveAllNotes = async () => {
    setSaving(true);
    try {
        const promises = Object.keys(notes).map(async (idEtudStr) => {
            const idEtudiant = Number(idEtudStr);
            const noteData = notes[idEtudiant];

            if (!noteData.valeur || noteData.valeur.trim() === "") return; 

            const payload = {
                idEtudiant: idEtudiant,
                idModule: Number(idModule),
                valeur: parseFloat(noteData.valeur),
                session: noteData.session || 'normal'
            };

            if (noteData.id_note) {
                return NoteService.updateNote(noteData.id_note, payload);
            } else {
                return NoteService.createNote(payload);
            }
        });

        await Promise.all(promises);
        alert("Notes enregistrées avec succès !");
        loadData();

    } catch (error) {
        console.error("Erreur sauvegarde", error);
        alert("Erreur lors de la sauvegarde.");
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-800 mb-2 transition">
                <ArrowLeft size={18} className="mr-1" /> Retour
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Saisie des Notes</h1>
            <p className="text-gray-500 mt-1">
                Module : <span className="font-semibold text-blue-600">{module?.nom_module}</span> ({module?.code_module})
            </p>
        </div>
        <button 
            onClick={saveAllNotes}
            disabled={saving}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition shadow-lg flex items-center gap-2 disabled:opacity-70"
        >
            {saving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
            Enregistrer tout
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase">
                <tr>
                    <th className="p-4 font-semibold">Étudiant</th>
                    <th className="p-4 font-semibold text-center w-32">Matricule</th>
                    <th className="p-4 font-semibold text-center w-40">Note / 20</th>
                    <th className="p-4 font-semibold text-center w-40">Session</th>
                    <th className="p-4 font-semibold text-center w-32">Statut</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {students.map(student => {
                    const currentNote = notes[student.id] || { valeur: '', session: 'normal' };
                    const isValide = parseFloat(currentNote.valeur) >= 10;

                    return (
                        <tr key={student.id} className="hover:bg-gray-50 transition">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase">
                                        {student.nom.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{student.nom.toUpperCase()} {student.prenom}</p>
                                        <p className="text-xs text-gray-500">{student.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-center font-mono text-gray-600">{student.matricule}</td>
                            <td className="p-4 text-center">
                                <input 
                                    type="number" 
                                    min="0" max="20" step="0.25"
                                    value={currentNote.valeur}
                                    onChange={(e) => handleNoteChange(student.id, 'valeur', e.target.value)}
                                    className={`w-24 text-center p-2 border rounded-lg focus:ring-2 outline-none font-bold transition
                                        ${isValide && currentNote.valeur !== '' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 focus:ring-emerald-500' : 'border-gray-300 focus:ring-blue-500'}
                                    `}
                                    placeholder="--"
                                />
                            </td>
                            <td className="p-4 text-center">
                                <select
                                    value={currentNote.session}
                                    onChange={(e) => handleNoteChange(student.id, 'session', e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="rattrapage">Rattrapage</option>
                                </select>
                            </td>
                            <td className="p-4 text-center">
                                {currentNote.valeur !== '' ? (
                                    isValide ? 
                                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm bg-emerald-100 px-3 py-1 rounded-full"><CheckCircle size={14}/> Validé</span> : 
                                    <span className="text-red-500 font-bold text-sm bg-red-100 px-3 py-1 rounded-full">Non Validé</span>
                                ) : (
                                    <span className="text-gray-400 text-sm">-</span>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        
        {students.length === 0 && (
            <div className="p-10 text-center text-gray-500 italic bg-gray-50">
                Aucun étudiant trouvé pour le semestre {module?.semestre}.
            </div>
        )}
      </div>
    </div>
  );
}