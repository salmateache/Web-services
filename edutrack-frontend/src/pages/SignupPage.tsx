import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Shield, Loader2, CheckCircle } from "lucide-react";
import { authService } from "../services/authService";

export default function SignupPage() {
  const navigate = useNavigate();
  
  // Ajout du champ confirmPassword dans le state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "ETUDIANT"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Gestionnaire générique pour les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // On efface l'erreur dès que l'utilisateur tape quelque chose
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // --- 1. VALIDATIONS FRONTEND ---
    
    // Vérification mot de passe vide ou trop court
    if (formData.password.length < 4) {
        setError("Le mot de passe doit contenir au moins 4 caractères.");
        setLoading(false);
        return;
    }

    // Vérification de la correspondance des mots de passe
    if (formData.password !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        setLoading(false);
        return;
    }

    // --- 2. APPEL SERVICE ---
    try {
      // On n'envoie pas confirmPassword au backend
      await authService.signup(formData.username, formData.password, formData.role);
      
      // Petit délai pour l'UX ou redirection immédiate
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Inscription</h2>
          <p className="text-gray-500 text-sm">Créez votre compte EduTrack</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center animate-pulse">
            <Shield size={16} className="mr-2"/> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NOM D'UTILISATEUR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                name="username"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                placeholder="Ex: etudiant123"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* MOT DE PASSE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="password" 
                name="password"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* CONFIRMATION MOT DE PASSE (Nouveau) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <div className="relative">
              <CheckCircle className={`absolute left-3 top-3 ${formData.confirmPassword && formData.password === formData.confirmPassword ? "text-green-500" : "text-gray-400"}`} size={18} />
              <input 
                type="password" 
                name="confirmPassword"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none transition
                    ${formData.confirmPassword && formData.password !== formData.confirmPassword 
                        ? "border-red-300 focus:ring-2 focus:ring-red-200" 
                        : "border-gray-300 focus:ring-2 focus:ring-green-500"}`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas.</p>
            )}
          </div>

          {/* RÔLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 text-gray-400" size={18} />
              <select 
                name="role"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white cursor-pointer"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="ETUDIANT">Étudiant</option>
                <option value="PROFESSEUR">Professeur</option>
                <option value="ADMINISTRATEUR">Administrateur</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-70 shadow-md hover:shadow-lg transform active:scale-95 duration-150"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : "S'inscrire"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}