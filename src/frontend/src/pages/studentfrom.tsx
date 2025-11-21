import React from "react";

interface Props {
  nom: string;
  prenom: string;
  matricule: string;
  email: string;
  setNom: (v: string) => void;
  setPrenom: (v: string) => void;
  setMatricule: (v: string) => void;
  setEmail: (v: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  submitLabel?: string; // pour changer le texte du bouton (Ajouter / Modifier)
}

const StudentForm: React.FC<Props> = ({
  nom,
  prenom,
  matricule,
  email,
  setNom,
  setPrenom,
  setMatricule,
  setEmail,
  handleSubmit,
  submitLabel = "Ajouter",
}) => {
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-6 bg-white rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Nom"
        value={nom}
        onChange={e => setNom(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="text"
        placeholder="Prénom"
        value={prenom}
        onChange={e => setPrenom(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="text"
        placeholder="Matricule"
        value={matricule}
        onChange={e => setMatricule(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default StudentForm;
