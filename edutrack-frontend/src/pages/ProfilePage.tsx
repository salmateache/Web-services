import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { studentService } from '../services/studentService';
import { professorService } from '../services/professorService'; 
import { User, Mail, Shield, BookOpen, GraduationCap, Loader2, Lock, Fingerprint, X, CheckCircle, AlertCircle, Save, UserCircle } from 'lucide-react';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // États pour le changement de mot de passe
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passData, setPassData] = useState({ oldPass: "", newPass: "", confirmPass: "" });
  const [passMessage, setPassMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setCurrentUser(user);
    loadFullProfile(user);
  }, []);

  const loadFullProfile = async (user: any) => {
    try {
      let profileData = null;
      if (user.role === "ETUDIANT") {
        const results = await studentService.searchStudentsByName(user.username);
        if (results && results.length > 0) profileData = results[0];
      } else if (user.role === "PROFESSEUR") {
        const allProfs = await professorService.getAllProfessors();
        profileData = allProfs.find((p: any) => 
            (p.nom && p.nom.toLowerCase().includes(user.username.toLowerCase())) || 
            (p.prenom && p.prenom.toLowerCase().includes(user.username.toLowerCase()))
        );
      } else {
        profileData = { nom: "Administrateur", prenom: "", email: "admin@edutrack.com" };
      }
      setUserProfile(profileData);
    } catch (error) {
      console.error("Erreur chargement profil", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setPassMessage(null);

      if (passData.newPass !== passData.confirmPass) {
          setPassMessage({ type: 'error', text: "Les nouveaux mots de passe ne correspondent pas." });
          return;
      }
      if (passData.newPass.length < 4) {
          setPassMessage({ type: 'error', text: "Le mot de passe est trop court." });
          return;
      }

      setPassLoading(true);
      try {
          await authService.changePassword(passData.oldPass, passData.newPass);
          setPassMessage({ type: 'success', text: "Mot de passe modifié avec succès !" });
          setPassData({ oldPass: "", newPass: "", confirmPass: "" });
          setTimeout(() => {
              setShowPasswordModal(false);
              setPassMessage(null);
          }, 2000);
      } catch (err: any) {
          setPassMessage({ type: 'error', text: err.message });
      } finally {
          setPassLoading(false);
      }
  };

  const getFullName = () => {
      if (!userProfile) return currentUser?.username;
      const prenom = userProfile.prenom || "";
      const nom = userProfile.nom || "";
      return `${prenom} ${nom}`.trim() || currentUser?.username;
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <UserCircle className="text-blue-600" size={32} /> Mon Profil
      </h1>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className={`p-6 text-white ${currentUser?.role === 'ADMINISTRATEUR' ? 'bg-purple-600' : currentUser?.role === 'PROFESSEUR' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold border-2 border-white/50 uppercase">
              {currentUser?.username ? currentUser.username.charAt(0) : "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold capitalize">{getFullName()}</h2>
              <p className="opacity-90 flex items-center gap-2 text-sm mt-1">
                <Shield size={14} /> {currentUser?.role}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Infos Personnelles */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Informations Personnelles</h3>
            <div>
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                <div className="flex items-center gap-3 text-gray-800 font-medium p-3 bg-gray-50 rounded-lg">
                    <Mail size={18} className="text-gray-400" />
                    {userProfile?.email || "Non renseigné"}
                </div>
            </div>
            <div>
                <label className="block text-sm text-gray-500 mb-1">Identifiant Connexion</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg font-mono text-blue-600 font-bold">
                    <Fingerprint size={18} className="text-gray-400" />
                    {userProfile?.matricule || currentUser?.username}
                </div>
            </div>
          </div>

          {/* Infos Académiques */}
          {(currentUser?.role === "ETUDIANT" || currentUser?.role === "PROFESSEUR") && userProfile && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                {currentUser.role === "ETUDIANT" ? "Cursus Académique" : "Informations Professionnelles"}
              </h3>
              {currentUser.role === "ETUDIANT" && (
                <>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Filière</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <BookOpen size={18} className="text-gray-400" />
                      {userProfile.filiere || "Non renseignée"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Niveau</label>
                        <div className="p-3 bg-gray-50 rounded-lg font-medium">{userProfile.niveau || "N/A"}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Semestre</label>
                        <div className="p-3 bg-blue-50 text-blue-700 rounded-lg font-bold text-center">
                            S{userProfile.semestreActuel || "?"}
                        </div>
                    </div>
                  </div>
                </>
              )}
              {currentUser.role === "PROFESSEUR" && (
                <>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Spécialité</label>
                    <div className="p-3 bg-gray-50 rounded-lg">{userProfile.specialite || "N/A"}</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Grade</label>
                    <div className="p-3 bg-gray-50 rounded-lg">{userProfile.grade || "N/A"}</div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Bouton Changer Mot de Passe */}
        <div className="bg-gray-50 p-6 flex justify-end">
            <button 
                onClick={() => setShowPasswordModal(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow flex items-center gap-2"
            >
                <Lock size={18} /> Changer mon mot de passe
            </button>
        </div>
      </div>

      {/* MODAL CHANGEMENT MOT DE PASSE */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6 border-b pb-2">
                    <h2 className="text-xl font-bold text-gray-800">Sécurité</h2>
                    <button onClick={() => setShowPasswordModal(false)}><X size={24} className="text-gray-400" /></button>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label>
                        <input type="password" required 
                            value={passData.oldPass} 
                            onChange={(e) => setPassData({...passData, oldPass: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                        <input type="password" required 
                            value={passData.newPass} 
                            onChange={(e) => setPassData({...passData, newPass: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                        <input type="password" required 
                            value={passData.confirmPass} 
                            onChange={(e) => setPassData({...passData, confirmPass: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>

                    {passMessage && (
                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${passMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {passMessage.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                            {passMessage.text}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Annuler</button>
                        <button type="submit" disabled={passLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow disabled:opacity-50">
                            {passLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Confirmer
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}