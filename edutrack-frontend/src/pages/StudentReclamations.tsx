import React, { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { studentService } from "../services/studentService";
import NoteService from "../services/NoteService";
import ModuleService from "../services/ModuleService"; // 👈 Import du service Module
import { Loader2, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale/fr';

interface Reclamation {
    id: number;
    idEtudiant: number;
    idModule: number; // L'ID est utilisé pour chercher le nom
    motif: string;
    statut: string;
    dateSoumission: string; 
}

export default function StudentReclamations() {
    const [loading, setLoading] = useState(true);
    const [reclamations, setReclamations] = useState<Reclamation[]>([]); 
    const [currentStudent, setCurrentStudent] = useState<any>(null);
    const [error, setError] = useState<string | null>(null); 
    // NOUVEL ÉTAT : Map des modules {ID: Nom}
    const [moduleMap, setModuleMap] = useState<Record<number, string>>({}); 

    useEffect(() => {
        loadReclamations();
    }, []);

    const loadReclamations = async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user) return;

            // 1. Identifier l'étudiant
            const studentResults = await studentService.searchStudentsByName(user.username);
            const student = studentResults[0];
            
            if (!student) {
                setError("Votre profil étudiant est introuvable. Connexion non liée.");
                return;
            }
            setCurrentStudent(student);

            // 2. Charger les modules et les réclamations en parallèle
            const [recsResult, modulesResult] = await Promise.all([
                NoteService.getReclamationsByEtudiant(student.id),
                ModuleService.getAllModules() // 👈 Appel pour la Map
            ]);
            
            // 3. Construction de la Map Module {ID: Nom}
            const allModulesData = modulesResult.data as any;
            const allModules = Array.isArray(allModulesData) ? allModulesData : (allModulesData.content || []);
            
            const map: Record<number, string> = {};
            allModules.forEach((m: any) => {
                const id = m.id_module || m.idModule; // Gère les deux cas de nommage
                map[id] = m.nom_module;
            });
            setModuleMap(map);


            // 4. Charger les réclamations
            const recs = Array.isArray(recsResult) ? recsResult : [];
            setReclamations(recs);

        } catch (error) {
            console.error("Erreur chargement réclamations", error);
            setError("Erreur réseau : Impossible de joindre les services.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (statut: string) => {
        switch (statut) {
            case 'EN_ATTENTE':
                return "bg-yellow-100 text-yellow-800";
            case 'TRAITEE':
                return "bg-emerald-100 text-emerald-800";
            case 'REJETEE':
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    
    const getStatusIcon = (statut: string) => {
        switch (statut) {
            case 'EN_ATTENTE':
                return <Clock size={16} className="inline mr-1" />;
            case 'TRAITEE':
                return <CheckCircle size={16} className="inline mr-1" />;
            case 'REJETEE':
                return <XCircle size={16} className="inline mr-1" />;
            default:
                return <AlertCircle size={16} className="inline mr-1" />;
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

    if (error) return (
        <div className="mt-8 p-6 bg-red-100 text-red-700 rounded-lg shadow-md max-w-4xl mx-auto">
            <AlertCircle size={24} className="inline mr-2" />
            <span className="font-bold">Erreur :</span> {error}
        </div>
    );

    return (
        <div className="p-8 bg-gray-50 min-h-full font-sans">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <MessageSquare size={24} className="text-blue-600" /> Vos Réclamations
            </h1>
            <p className="text-gray-500 mb-6">Liste de toutes les demandes soumises par {currentStudent?.prenom} {currentStudent?.nom}.</p>

            {reclamations.length === 0 ? ( 
                <div className="mt-8 p-6 bg-blue-50 text-blue-800 rounded-lg flex items-center border border-blue-200">
                    <AlertCircle size={20} className="mr-3" />
                    Vous n'avez soumis aucune réclamation pour le moment.
                </div>
            ) : (
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Module
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Motif
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reclamations.map((rec) => (
                                <tr key={rec.id} className="hover:bg-gray-50 transition duration-150">
                                    {/* ✅ AFFICHAGE DU NOM DU MODULE via la map */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {moduleMap[rec.idModule] || `Module #${rec.idModule}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-lg truncate">
                                        {rec.motif}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(rec.dateSoumission), 'dd MMM yyyy à HH:mm', { locale: fr })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(rec.statut)}`}>
                                            {getStatusIcon(rec.statut)} {rec.statut.replace('_', ' ')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}