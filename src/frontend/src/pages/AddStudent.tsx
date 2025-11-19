import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddStudent: React.FC = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [matricule, setMatricule] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const student = { nom, prenom, matricule, email };

    try {
      const res = await fetch("http://localhost:8082/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });

      if (res.ok) {
        alert("Étudiant ajouté !");
        navigate("/");
      } else {
        alert("Erreur lors de l'ajout");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }
  };

  return (
    <div>
      <h2>Ajouter un étudiant</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required />
        <input placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required />
        <input placeholder="Matricule" value={matricule} onChange={e => setMatricule(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AddStudent;
