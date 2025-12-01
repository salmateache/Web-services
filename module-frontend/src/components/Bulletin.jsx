import React, { useState } from "react";
import NoteService from "../services/NoteService";
import generateBulletinPDF from "../utils/pdfGenerator";

function Bulletin() {
    const [idEtudiant, setIdEtudiant] = useState("");
    const [bulletin, setBulletin] = useState(null);

    const fetchBulletin = () => {
        if (!idEtudiant) return alert("Enter student ID");

        NoteService.getBulletin(idEtudiant)
            .then(response => {
                setBulletin(response.data);
            })
            .catch(() => alert("Error fetching bulletin"));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Relevé de Notes / Bulletin</h2>

            <div style={{ marginBottom: "20px" }}>
                <input
                    type="number"
                    placeholder="Enter student ID"
                    value={idEtudiant}
                    onChange={(e) => setIdEtudiant(e.target.value)}
                    style={{ padding: "8px", marginRight: "10px" }}
                />
                <button onClick={fetchBulletin} className="btn">
                    Load Bulletin
                </button>
            </div>

            {bulletin && (
                <div>
                    <h3>Bulletin for Student #{bulletin.idEtudiant}</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Module</th>
                                <th>Code</th>
                                <th>Coefficient</th>
                                <th>Note</th>
                                <th>Session</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bulletin.modules.map((m, i) => (
                                <tr key={i}>
                                    <td>{m.module}</td>
                                    <td>{m.code}</td>
                                    <td>{m.coefficient}</td>
                                    <td>{m.note}</td>
                                    <td>{m.session}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3>Moyenne: {bulletin.moyenne.toFixed(2)}</h3>
                    <h3>Decision: {bulletin.decision}</h3>

                    <button
                        className="btn"
                        onClick={() => generateBulletinPDF(bulletin)}
                    >
                        Generate PDF
                    </button>
                </div>
            )}
        </div>
    );
}

export default Bulletin;
