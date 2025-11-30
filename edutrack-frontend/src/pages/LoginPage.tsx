import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { authService } from "../services/authService";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  [key: string]: any;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = await authService.login(username, password);
      localStorage.setItem("token", token);

      // Décoder le token pour récupérer le rôle
      const decoded: DecodedToken = jwtDecode(token);

      // Redirection selon rôle
      switch (decoded.role) {
        case "ETUDIANT":
          navigate("/etudiant");
          break;
        case "PROFESSEUR":
          navigate("/professeur");
          break;
        case "ADMINISTRATEUR":
          navigate("/admin");
          break;
        default:
          navigate("/login");
          break;
      }
    } catch (err: any) {
      setError("Nom d'utilisateur ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 p-12">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={28} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Connexion</h2>
          <p className="text-gray-500 text-sm">Accédez à votre espace EduTrack</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-lg"
                placeholder="Ex: admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="password"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-lg"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-lg transition flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <>
                Se connecter
                <ArrowRight size={22} />
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Créer un compte
          </Link>
        </div>

      </div>
    </div>
  );
}
