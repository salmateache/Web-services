import React, { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { professorService } from "../services/professorService";
import NoteService from "../services/NoteService";
import { studentService } from "../services/studentService"; // 👈 Import Étudiant
import ModuleService from "../services/ModuleService";       // 👈 Import Module
import { Loader2, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight, Save } from "lucide-react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale/fr';

interface Reclamation {
    id: number;
    idEtudiant: number;
    idModule: number;
    motif: string;
    statut: string;
    dateSoumission: string; 
}

export default function ProfessorReclamations() {
    const [loading, setLoading] = useState(true);
    const [reclamations, setReclamations] = useState<Reclamation[]>([]);
    const [currentProf, setCurrentProf] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    
    // NOUVEAUX ÉTATS POUR L'AGRÉGATION (Lookup Maps)
    const [studentMap, setStudentMap] = useState<Record<number, any>>({});
    const [moduleMap, setModuleMap] = useState<Record<number, any>>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user) return;

            // 1. Identification du professeur
            const allProfs = await professorService.getAllProfessors();
            const prof = allProfs.find((p: any) => p.email === user.username || p.prenom?.toLowerCase() === user.username.toLowerCase());
            
            if (!prof) {
                setError("Votre profil professeur n'a pas pu être associé.");
                return;
            }
            setCurrentProf(prof);

            // 2. CHARGEMENT PARALLÈLE DE TOUTES LES DONNÉES TIERCES
            const [recsResult, studentsResult, modulesResult] = await Promise.all([
                NoteService.getReclamationsByProfesseur(prof.id),
                studentService.getAllStudents(), // Liste des étudiants
                ModuleService.getAllModules()    // Liste des modules
            ]);
            
            // 3. Construction des Maps de Lookup
            
            // Map 1 : Étudiants {ID: {nom, prenom}}
            const studentLookup: Record<number, any> = {};
            studentsResult.forEach((s: any) => {
                studentLookup[s.id] = { nom: s.nom, prenom: s.prenom, matricule: s.matricule };
            });
            setStudentMap(studentLookup);

            // Map 2 : Modules {ID: Nom du module}
            const allModules = (modulesResult.data as any).content || modulesResult.data;
            const moduleLookup: Record<number, any> = {};
            allModules.forEach((m: any) => {
                const id = m.id_module || m.idModule;
                moduleLookup[id] = m.nom_module;
            });
            setModuleMap(moduleLookup);
            
            // 4. Stockage des réclamations
            setReclamations(recsResult);

        } catch (error) {
            console.error("Erreur chargement réclamations prof", error);
            setError("Erreur réseau: Impossible de charger les réclamations.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (reclamationId: number, newStatus: string) => {
        if (!window.confirm(`Confirmer le changement de statut à "${newStatus}" ?`)) return;

        try {
            await NoteService.updateReclamationStatus(reclamationId, newStatus);
            
            // Mettre à jour la liste localement
            setReclamations(prev => prev.map(rec => 
                rec.id === reclamationId ? { ...rec, statut: newStatus } : rec
            ));
            
        } catch (error) {
            alert("Échec de la mise à jour du statut.");
        }
    };

    const getStatusStyle = (statut: string) => {
        switch (statut) {
            case 'EN_ATTENTE': return "bg-yellow-100 text-yellow-800";
            case 'TRAITEE': return "bg-emerald-100 text-emerald-800";
            case 'REJETEE': return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };
    
    const getStatusIcon = (statut: string) => {
        switch (statut) {
            case 'EN_ATTENTE': return <Clock size={16} className="inline mr-1" />;
            case 'TRAITEE': return <CheckCircle size={16} className="inline mr-1" />;
            case 'REJETEE': return <XCircle size={16} className="inline mr-1" />;
            default: return <AlertCircle size={16} className="inline mr-1" />;
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;
    if (error) return <div className="mt-8 p-6 bg-red-100 text-red-700 rounded-lg shadow-md max-w-4xl mx-auto"><AlertCircle size={24} className="mr-2" /> {error}</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-full font-sans">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MessageSquare size={24} className="text-blue-600" /> Gestion des Réclamations
            </h1>

            {reclamations.length === 0 ? (
                <div className="mt-8 p-6 bg-green-50 text-green-800 rounded-lg border border-green-200">
                    <CheckCircle size={20} className="mr-3" />
                    Aucune réclamation en attente ou en cours.
                </div>
            ) : (
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matricule</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motif</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reclamations.map((rec) => {
                                const student = studentMap[rec.idEtudiant];
                                const moduleName = moduleMap[rec.idModule] || `Module #${rec.idModule}`;
                                
                                return (
                                    <tr key={rec.id} className="hover:bg-gray-50 transition duration-150">
                                        {/* Colonne Module */}
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {moduleName}
                                        </td>
                                        
                                        {/* Colonne Étudiant */}
                                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                                            {student ? `${student.prenom} ${student.nom}` : `Étudiant #${rec.idEtudiant}`}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                            {student ? student.matricule : 'N/A'}
                                        </td>
                                        
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-sm">{rec.motif}</td>
                                        
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {format(new Date(rec.dateSoumission), 'dd MMM yyyy HH:mm', { locale: fr })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(rec.statut)}`}>
                                                {getStatusIcon(rec.statut)} {rec.statut.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                                            {rec.statut === 'EN_ATTENTE' ? (
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleUpdateStatus(rec.id, 'TRAITEE')}
                                                        className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg"
                                                    >
                                                        Traiter
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(rec.id, 'REJETEE')}
                                                        className="text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded-lg"
                                                    >
                                                        Rejeter
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 italic text-xs">Finalisée</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}