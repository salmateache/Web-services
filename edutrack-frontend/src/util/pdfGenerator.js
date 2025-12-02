import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateBulletinPDF = (bulletin, studentInfo) => {
  const doc = new jsPDF();

  // --- EN-TÊTE ---
  doc.setFontSize(22);
  doc.setTextColor(41, 128, 185); // Bleu EduTrack
  doc.text("Bulletin de Notes", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  // --- INFO ÉTUDIANT (C'est ici qu'on utilise studentInfo) ---
  const nomComplet = studentInfo 
      ? `${studentInfo.nom.toUpperCase()} ${studentInfo.prenom}` 
      : `Étudiant #${bulletin.idEtudiant}`;
  
  const matricule = studentInfo ? studentInfo.matricule : "N/A";
  const email = studentInfo ? studentInfo.email : "N/A";

  doc.text(`Nom & Prénom : ${nomComplet}`, 14, 40);
  doc.text(`Matricule : ${matricule}`, 14, 48);
  doc.text(`Email : ${email}`, 14, 56);

  // Ligne de séparation
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 62, 196, 62);

  // --- TABLEAU DES NOTES ---
  const tableColumn = ["Module", "Code", "Coef", "Note", "Session", "Résultat"];
  const tableRows = [];

  bulletin.modules.forEach((m) => {
    const noteData = [
      m.nom_module || m.module,
      m.code_module || m.code,
      m.coefficient,
      m.note || m.valeur,
      m.session,
      (m.note || m.valeur) >= 10 ? "VALIDÉ" : "NON VALIDÉ",
    ];
    tableRows.push(noteData);
  });

  autoTable(doc, {
    startY: 70,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185] }, // Bleu
    styles: { fontSize: 10, cellPadding: 3 },
    // Colorer en rouge si non validé
    didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 3) {
            const val = parseFloat(data.cell.raw);
            if (val < 10) {
                data.cell.styles.textColor = [231, 76, 60]; // Rouge
                data.cell.styles.fontStyle = 'bold';
            } else {
                data.cell.styles.textColor = [39, 174, 96]; // Vert
                data.cell.styles.fontStyle = 'bold';
            }
        }
    }
  });

  // --- PIED DE PAGE (Moyenne & Décision) ---
  const finalY = doc.lastAutoTable.finalY + 20;
  
  doc.setFontSize(14);
  doc.text(`Moyenne Générale : ${bulletin.moyenne.toFixed(2)} / 20`, 14, finalY);
  
  doc.setFontSize(14);
  if (bulletin.moyenne >= 10) {
      doc.setTextColor(39, 174, 96); // Vert
      doc.text(`Décision : ${bulletin.decision || "ADMIS"}`, 14, finalY + 10);
  } else {
      doc.setTextColor(231, 76, 60); // Rouge
      doc.text(`Décision : ${bulletin.decision || "AJOURNÉ"}`, 14, finalY + 10);
  }

  // --- SAUVEGARDE ---
  const fileName = studentInfo 
    ? `Bulletin_${studentInfo.nom}_${studentInfo.prenom}.pdf` 
    : `Bulletin_${bulletin.idEtudiant}.pdf`;
    
  doc.save(fileName);
};

export default generateBulletinPDF;