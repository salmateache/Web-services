import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";

interface Student {
  id?: number;
  nom: string;
  prenom: string;
  matricule: string;
  email: string;
}

interface Props {
  studentToEdit?: Student; // Optionnel
  onSaved?: () => void;    // Callback après sauvegarde
}

export default function AddStudent({ studentToEdit, onSaved }: Props) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [matricule, setMatricule] = useState("");
  const [email, setEmail] = useState("");

  // Pré-remplir le formulaire si on édite
  useEffect(() => {
    if (studentToEdit) {
      setNom(studentToEdit.nom);
      setPrenom(studentToEdit.prenom);
      setMatricule(studentToEdit.matricule);
      setEmail(studentToEdit.email);
    }
  }, [studentToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const student: Student = { nom, prenom, matricule, email };

    try {
      const url = studentToEdit
        ? `http://localhost:8082/api/students/${studentToEdit.id}`
        : "http://localhost:8082/api/students";

      const method = studentToEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });

      if (!response.ok) {
        const text = await response.text();
        alert("Erreur backend : " + text);
        return;
      }

      alert(studentToEdit ? "Étudiant modifié !" : "Étudiant ajouté !");
      setNom(""); setPrenom(""); setMatricule(""); setEmail("");
      onSaved?.(); // Notifier parent pour recharger la liste
    } catch (err) {
      console.error(err);
      alert("Impossible de contacter le serveur !");
    }
  };

  return (
    <div className="p-6 bg-beige-50 min-h-screen flex items-center justify-center">
      <Card className="rounded-2xl shadow-lg border border-blue-200 bg-white w-full max-w-xl">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            {studentToEdit ? "Modifier un étudiant" : "Ajouter un étudiant"}
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required className="w-full border rounded p-2"/>
            <input placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required className="w-full border rounded p-2"/>
            <input placeholder="Matricule" value={matricule} onChange={e => setMatricule(e.target.value)} required className="w-full border rounded p-2"/>
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded p-2"/>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
              {studentToEdit ? "Enregistrer" : "Ajouter"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
