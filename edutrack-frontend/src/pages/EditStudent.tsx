import { useEffect, useState } from "react";
import { studentService } from "../services/studentService";
import { useParams, useNavigate } from "react-router-dom";

interface StudentForm {
  nom: string;
  prenom: string;
  matricule: string;
  email: string;
}

const EditStudent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<StudentForm>({
    nom: "",
    prenom: "",
    matricule: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données de l'étudiant
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    studentService
      .getStudentById(Number(id))
      .then((res) => {
        setForm({
          nom: res.nom,
          prenom: res.prenom,
          matricule: res.matricule,
          email: res.email,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger les données de l'étudiant.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await studentService.updateStudent(Number(id), form);
      navigate("/admin/students");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour de l'étudiant.");
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center text-gray-500">
        Chargement des données de l'étudiant...
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
        {error}
      </div>
    );

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Modifier l'étudiant</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            name="nom"
            value={form.nom}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prénom</label>
          <input
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Matricule</label>
          <input
            name="matricule"
            value={form.matricule}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/students")}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Modifier
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;
