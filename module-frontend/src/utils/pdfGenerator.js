import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function generateBulletinPDF(data) {
const doc = new jsPDF();

doc.setFontSize(18);
doc.text("Relevé de Notes / Bulletin", 70, 15);

doc.setFontSize(12);
doc.text(`Étudiant ID: ${data.idEtudiant}`, 15, 30);
doc.text(`Moyenne Générale: ${data.moyenne.toFixed(2)}`, 15, 40);
doc.text(`Décision: ${data.decision}`, 15, 50);

const tableRows = data.modules.map(m => [
    m.module,
    m.code,
    m.coefficient,
    m.note,
    m.session
]);

// Corrected autoTable usage
autoTable(doc, {
    head: [["Module", "Code", "Coeff", "Note", "Session"]],
    body: tableRows,
    startY: 60
});

doc.save(`bulletin_${data.idEtudiant}.pdf`);

}