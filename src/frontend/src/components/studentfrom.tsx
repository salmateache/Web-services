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

const StudentForm: React.FC<Props> = ({ nom, prenom, matricule, email, setNom, setPrenom, setMatricule, setEmail, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required />
    <input placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required />
    <input placeholder="Matricule" value={matricule} onChange={e => setMatricule(e.target.value)} required />
    <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
    <button type="submit">Ajouter</button>
  </form>
);

export default StudentForm;
