import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/authService";
import { studentService } from "../services/studentService";
import ModuleService from "../services/ModuleService";
import NoteService from "../services/NoteService";
// ❌ Suppression de l'import de professorService (non nécessaire ici)
import { Loader2, BookOpen, GraduationCap, Edit, Calendar, Eye, AlertCircle, User } from "lucide-react"; 

export default function StudentModules() {
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState<any[]>([]);
    const [currentStudent, setCurrentStudent] = useState<any>(null);
    const [notesMap, setNotesMap] = useState<Record<number, any>>({});
    
    // ❌ Suppression de professorsMap (non nécessaire ici)

    useEffect(() => {
        loadStudentModules();
    }, []);

    const loadStudentModules = async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user) return;

            // 1. Identifier l'étudiant
            const studentResults = await studentService.searchStudentsByName(user.username);
            const student = studentResults[0];
            if (!student) return;
            setCurrentStudent(student);

            // 2. Charger les modules et les notes (plus besoin des profs ici)
            const [modulesRes, notesRes] = await Promise.all([
                ModuleService.getAllModules(),
                NoteService.getNotesByEtudiant(student.id),
            ]);

            const allModules = (modulesRes.data as any).content || modulesRes.data;
            const studentNotes = notesRes.data;

            // 3. Construction des Maps Notes
            const notesLookup: any = {};
            studentNotes.forEach((n: any) => {
                notesLookup[n.idModule || n.id_module] = n; 
            });
            setNotesMap(notesLookup);

            // 4. Filtrer les modules du semestre actuel
            const currentSemestreModules = allModules.filter((m: any) => m.semestre === student.semestreActuel);
            
            setModules(currentSemestreModules);

        } catch (error) {
            console.error("Erreur chargement modules etudiant", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

    return (
        <div className="p-8 bg-gray-50 min-h-full font-sans">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Modules S{currentStudent?.semestreActuel || 'N/A'}
            </h1>
            <p className="text-gray-500 mb-6">Liste des cours pour la filière {currentStudent?.filiere}.</p>

            {modules.length === 0 ? (
                 <div className="mt-8 p-4 bg-yellow-100 text-yellow-800 rounded-lg flex items-center">
                    <AlertCircle size={20} className="mr-2" />
                    Aucun module n'est encore enregistré pour ce semestre.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => {
                        const note = notesMap[module.id_module];
                        const noteValue = note?.valeur || "--";
                        const isValidated = noteValue !== "--" && noteValue >= 10;
                        
                        // ❌ Suppression de la logique 'responsibleName' (ce n'est pas nécessaire ici)

                        return (
                            <div key={module.id_module} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{module.nom_module}</h3>
                                    <p className="text-sm text-gray-400 font-mono mb-4">{module.code_module} • Coeff: {module.coefficient}</p>

                                    {/* AFFICHAGE SIMPLIFIÉ DU RESPONSABLE (peut être réintroduit si l'on veut juste l'ID) */}
                                    
                                </div>
                                
                                <div className="border-t pt-4 mt-auto">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                            Note:
                                        </p>
                                        <span className={`text-xl font-bold ${isValidated ? 'text-emerald-600' : (noteValue === '--' ? 'text-gray-400' : 'text-red-600')}`}>
                                            {noteValue} / 20
                                        </span>
                                    </div>
                                    
                                    <Link 
                                        to={`/etudiant/modules/${module.id_module}`} 
                                        className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition flex items-center justify-center gap-2"
                                    >
                                        <Eye size={16} /> Détails & Réclamation
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}