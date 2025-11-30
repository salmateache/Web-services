// src/pages/AdminPage.tsx
import React from "react";

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrateur</h1>
      <p className="text-gray-600 mt-2">Bienvenue — cette page est vide pour l'instant. Tu pourras y ajouter des widgets / statistiques plus tard.</p>

      {/* Placeholder box */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 italic">Ici tu pourras mettre des statistiques, graphiques ou raccourcis administrateur.</p>
      </div>
    </div>
  );
}
