package com.Module.Module.service;

import com.Module.Module.model.Module;
import com.Module.Module.model.Note;
import com.Module.Module.repository.NoteRepository;
import com.Module.Module.repository.ModuleRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final ModuleRepository moduleRepository;

    public NoteService(NoteRepository noteRepository, ModuleRepository moduleRepository) {
        this.noteRepository = noteRepository;
        this.moduleRepository = moduleRepository;
    }

    public Note addNote(Note note) {
        return noteRepository.save(note);
    }

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    public List<Note> getNotesByEtudiant(Long idEtudiant) {
        return noteRepository.findByIdEtudiant(idEtudiant);
    }

    public List<Note> getNotesByModule(Long idModule) {
        return noteRepository.findByIdModule(idModule);
    }

    public Note updateNote(Long id, Note noteDetails) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        note.setValeur(noteDetails.getValeur());
        note.setSession(noteDetails.getSession());

        return noteRepository.save(note);
    }

    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    // ------------------------------------------------------
    // 🚀 STEP 3 — CALCULATE MOYENNE
    // ------------------------------------------------------
    public Map<String, Object> calculateMoyenne(Long idEtudiant) {

        List<Note> notes = noteRepository.findByIdEtudiant(idEtudiant);

        double totalWeighted = 0;
        double totalCoeff = 0;

        for (Note note : notes) {
            Module module = moduleRepository.findById(note.getIdModule()).orElse(null);
            if (module == null) continue;

            totalWeighted += note.getValeur() * module.getCoefficient();
            totalCoeff += module.getCoefficient();
        }

        double moyenne = totalCoeff == 0 ? 0 : totalWeighted / totalCoeff;

        Map<String, Object> response = new HashMap<>();
        response.put("idEtudiant", idEtudiant);
        response.put("moyenne", moyenne);

        return response;
    }

    // ------------------------------------------------------
    // 🚀 STEP 4 — BULLETIN DATA FOR FRONT PDF
    // ------------------------------------------------------
    // ... imports ...

    // AJOUT du paramètre 'semestre'
    public Map<String, Object> getBulletin(Long idEtudiant, Integer semestre) {

        List<Note> notes = noteRepository.findByIdEtudiant(idEtudiant);
        List<Map<String, Object>> modulesList = new ArrayList<>();

        double totalWeighted = 0;
        double totalCoeff = 0;

        for (Note note : notes) {
            Module module = moduleRepository.findById(note.getIdModule()).orElse(null);
            
            // FILTRE : Si le module n'est pas du semestre demandé, on l'ignore
            if (module == null || module.getSemestre() != semestre) continue;

            Map<String, Object> item = new HashMap<>();
            item.put("module", module.getNomModule());
            item.put("code", module.getCodeModule());
            item.put("coefficient", module.getCoefficient());
            item.put("note", note.getValeur());
            item.put("session", note.getSession());

            modulesList.add(item);

            totalWeighted += note.getValeur() * module.getCoefficient();
            totalCoeff += module.getCoefficient();
        }

        double moyenne = totalCoeff == 0 ? 0 : totalWeighted / totalCoeff;
        String decision = moyenne >= 10 ? "VALIDÉ" : "NON VALIDÉ";

        Map<String, Object> response = new HashMap<>();
        response.put("idEtudiant", idEtudiant);
        response.put("semestre", semestre); // On renvoie le semestre
        response.put("modules", modulesList);
        response.put("moyenne", moyenne);
        response.put("decision", decision);

        return response;
    }
}
