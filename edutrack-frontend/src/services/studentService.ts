const STUDENT_API_URL = "http://localhost:8082/api/students";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token manquant");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const studentService = {
  getAllStudents: async () => {
    const res = await fetch(STUDENT_API_URL, { method: "GET", headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Impossible de charger les étudiants.");
    return res.json();
  },

  getStudentById: async (id: number) => {
    const res = await fetch(`${STUDENT_API_URL}/${id}`, { method: "GET", headers: getAuthHeaders() });
    if (!res.ok) throw new Error("Étudiant introuvable.");
    return res.json();
  },

  createStudent: async (student: any) => {
    const res = await fetch(STUDENT_API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(student),
    });
    if (!res.ok) throw new Error("Erreur lors de l'ajout de l'étudiant.");
    return res.json();
  },

  updateStudent: async (id: number, student: any) => {
    const res = await fetch(`${STUDENT_API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(student),
    });
    if (!res.ok) throw new Error("Erreur lors de la modification de l'étudiant.");
    return res.json();
  },

  deleteStudent: async (id: number) => {
    const res = await fetch(`${STUDENT_API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression.");
    return true;
  },

  // --- NOUVELLE MÉTHODE : RECHERCHE PAR NOM ---
  searchStudentsByName: async (nom: string) => {
    // Appelle l'endpoint que tu as créé dans le backend Java
    const res = await fetch(`${STUDENT_API_URL}/search?nom=${nom}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Erreur lors de la recherche.");
    return res.json();
  },

  exportStudentsExcel: async () => {
    const res = await fetch(`${STUDENT_API_URL}/export`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Impossible d'exporter les étudiants");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "etudiants.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
  },
};