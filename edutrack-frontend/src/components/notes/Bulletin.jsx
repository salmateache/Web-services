import React, { useState } from "react";
import { Search, FileText, Download, Loader2, AlertCircle, GraduationCap, User, BookOpen } from "lucide-react";
import NoteService from "../../services/NoteService";
import { studentService } from "../../services/studentService"; 
import generateBulletinPDF from "../../util/pdfGenerator"; 

export default function Bulletin() {
    const [searchTerm, setSearchTerm] = useState("");
    const [semestre, setSemestre] = useState(1); // Par défaut Semestre 1
    
    const [bulletin, setBulletin] = useState(null);
    const [foundStudent, setFoundStudent] = useState(null); 
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) return;

        setLoading(true);
        setError(null);
        setBulletin(null);
        setFoundStudent(null);

        try {
            // 1. Chercher l'étudiant (Nom ou Matricule)
            const students = await studentService.searchStudentsByName(searchTerm);

            if (!students || students.length === 0) {
                setError("Aucun étudiant trouvé (Nom ou Matricule incorrect).");
                setLoading(false);
                return;
            }

            const targetStudent = students[0];
            setFoundStudent(targetStudent); 

            // 2. Chercher le bulletin pour l'ID et le Semestre choisi
            // Note: On utilise 'semestre' qui est dans le state
            const response = await NoteService.getBulletin(targetStudent.id, semestre);
            setBulletin(response.data);

        } catch (err) {
            console.error("Erreur:", err);
            setError("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-0 font-sans bg-gray-50 min-h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="text-blue-600" /> Relevés de Notes
                </h1>
            </div>

            {/* FORMULAIRE DE RECHERCHE */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 max-w-3xl">
                <form onSubmit={handleSearch} className="flex gap-4 items-end flex-wrap">
                    
                    {/* Recherche Texte */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Étudiant (Nom ou Matricule)
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text" 
                                placeholder="Ex: Salma, MAT2025..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                            />
                        </div>
                    </div>

                    {/* Sélecteur Semestre */}
                    <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Semestre
                        </label>
                        <select 
                            value={semestre}
                            onChange={(e) => setSemestre(Number(e.target.value))}
                            className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                        >
                            <option value="1">S1</option>
                            <option value="2">S2</option>
                            <option value="3">S3</option>
                            <option value="4">S4</option>
                            <option value="5">S5</option>
                            <option value="6">S6</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={!searchTerm || loading}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition shadow-sm flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Afficher"}
                    </button>
                </form>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center border border-red-100 mb-6">
                    <AlertCircle className="mr-3 shrink-0" size={24} />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {bulletin && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slideUp">
                    {/* EN-TÊTE DU BULLETIN */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                                    <GraduationCap size={24} /> Bulletin - Semestre {semestre}
                                </h2>
                                
                                <div className="flex flex-col gap-1 text-blue-100 text-sm">
                                    <p className="flex items-center gap-2 text-white text-lg font-semibold">
                                        <User size={18} /> 
                                        {foundStudent ? `${foundStudent.prenom} ${foundStudent.nom}` : "Étudiant inconnu"}
                                    </p>
                                    <p>Matricule: <span className="text-white font-medium">{foundStudent?.matricule || "N/A"}</span></p>
                                    <p className="flex items-center gap-2 mt-1">
                                        <BookOpen size={16} />
                                        {foundStudent?.niveau} - {foundStudent?.filiere}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => generateBulletinPDF(bulletin, foundStudent)}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition flex items-center gap-2 text-sm font-medium border border-white/30"
                            >
                                <Download size={18} /> PDF
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="overflow-x-auto mb-8 rounded-lg border border-gray-200">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                                    <tr>
                                        <th className="p-4 font-semibold">Module</th>
                                        <th className="p-4 font-semibold">Code</th>
                                        <th className="p-4 font-semibold text-center">Coef.</th>
                                        <th className="p-4 font-semibold text-center">Note / 20</th>
                                        <th className="p-4 font-semibold text-center">Session</th>
                                        <th className="p-4 font-semibold text-center">Résultat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {bulletin.modules && bulletin.modules.length > 0 ? (
                                        bulletin.modules.map((m, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition">
                                                <td className="p-4 font-medium text-gray-900">{m.module || m.nom_module}</td>
                                                <td className="p-4 text-gray-500">{m.code || m.code_module}</td>
                                                <td className="p-4 text-center">{m.coefficient}</td>
                                                <td className="p-4 text-center font-bold">
                                                    <span className={m.note >= 10 ? "text-emerald-600" : "text-red-600"}>
                                                        {m.note}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                        ${m.session === 'rattrapage' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {m.session || 'Normal'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    {m.note >= 10 ? (
                                                        <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded">V</span>
                                                    ) : (
                                                        <span className="text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded">NV</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-gray-500 italic">
                                                Aucune note trouvée pour le Semestre {semestre}.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col md:flex-row justify-end gap-6 border-t pt-6">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 w-full md:w-64">
                                <p className="text-gray-500 text-sm mb-1 uppercase font-semibold">Moyenne S{semestre}</p>
                                <p className={`text-3xl font-bold ${bulletin.moyenne >= 10 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {Number(bulletin.moyenne).toFixed(2)} / 20
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 w-full md:w-64">
                                <p className="text-gray-500 text-sm mb-1 uppercase font-semibold">Décision</p>
                                <p className={`text-xl font-bold uppercase ${bulletin.moyenne >= 10 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {bulletin.decision}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}