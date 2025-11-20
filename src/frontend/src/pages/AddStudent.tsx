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
  handleSubmit
}) => (
  <form onSubmit={handleSubmit} className="bg-beige-100 p-6 rounded-2xl shadow-md space-y-4 max-w-md mx-auto">
    <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">Ajouter un étudiant</h2>
    <input
      placeholder="Nom"
      value={nom}
      onChange={e => setNom(e.target.value)}
      required
      className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
    <input
      placeholder="Prénom"
      value={prenom}
      onChange={e => setPrenom(e.target.value)}
      required
      className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
    <input
      placeholder="Matricule"
      value={matricule}
      onChange={e => setMatricule(e.target.value)}
      required
      className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
    <input
      placeholder="Email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      required
      type="email"
      className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
    <button
      type="submit"
      className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
    >
      Ajouter
    </button>
  </form>
);

export default StudentForm;
