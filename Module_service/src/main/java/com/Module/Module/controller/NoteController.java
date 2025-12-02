package com.Module.Module.controller;

import com.Module.Module.model.Note;
import com.Module.Module.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    // --- AJOUTER UNE NOTE ---
    @PostMapping
    public ResponseEntity<Note> addNote(@RequestBody Note note) {
        return ResponseEntity.status(201).body(noteService.addNote(note));
    }

    // --- LISTE DE TOUTES LES NOTES ---
    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes() {
        return ResponseEntity.ok(noteService.getAllNotes());
    }

    // --- NOTE PAR ID ---
    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        return noteService.getNoteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- NOTES D'UN ÉTUDIANT ---
    @GetMapping("/etudiant/{idEtudiant}")
    public ResponseEntity<List<Note>> getNotesByEtudiant(@PathVariable Long idEtudiant) {
        return ResponseEntity.ok(noteService.getNotesByEtudiant(idEtudiant));
    }

    // --- NOTES D'UN MODULE ---
    @GetMapping("/module/{idModule}")
    public ResponseEntity<List<Note>> getNotesByModule(@PathVariable Long idModule) {
        return ResponseEntity.ok(noteService.getNotesByModule(idModule));
    }

    // --- METTRE À JOUR UNE NOTE ---
    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note noteDetails) {
        try {
            return ResponseEntity.ok(noteService.updateNote(id, noteDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- SUPPRIMER UNE NOTE ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    // ------------------------------------------------------
    // 🚀 STEP 3 — CALCUL DE LA MOYENNE GÉNÉRALE
    // ------------------------------------------------------
    @GetMapping("/moyenne/{idEtudiant}")
    public ResponseEntity<Map<String, Object>> getMoyenne(@PathVariable Long idEtudiant) {
        return ResponseEntity.ok(noteService.calculateMoyenne(idEtudiant));
    }

    // ------------------------------------------------------
    // 🚀 STEP 4 — RÉCUPÉRER LE BULLETIN PAR SEMESTRE
    // ------------------------------------------------------
    // Modification ici : Ajout de /{semestre} dans l'URL
    @GetMapping("/bulletin/{idEtudiant}/{semestre}")
    public ResponseEntity<Map<String, Object>> getBulletin(
            @PathVariable Long idEtudiant, 
            @PathVariable Integer semestre
    ) {
        // On appelle la méthode du service avec les 2 paramètres
        return ResponseEntity.ok(noteService.getBulletin(idEtudiant, semestre));
    }
}