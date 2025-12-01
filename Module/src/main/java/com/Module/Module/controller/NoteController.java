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

    @PostMapping
    public ResponseEntity<Note> addNote(@RequestBody Note note) {
        return ResponseEntity.status(201).body(noteService.addNote(note));
    }

    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes() {
        return ResponseEntity.ok(noteService.getAllNotes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        return noteService.getNoteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/etudiant/{idEtudiant}")
    public ResponseEntity<List<Note>> getNotesByEtudiant(@PathVariable Long idEtudiant) {
        return ResponseEntity.ok(noteService.getNotesByEtudiant(idEtudiant));
    }

    @GetMapping("/module/{idModule}")
    public ResponseEntity<List<Note>> getNotesByModule(@PathVariable Long idModule) {
        return ResponseEntity.ok(noteService.getNotesByModule(idModule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note noteDetails) {
        try {
            return ResponseEntity.ok(noteService.updateNote(id, noteDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    // ------------------------------------------------------
    // 🚀 STEP 3 — CALCULATE MOYENNE
    // ------------------------------------------------------
    @GetMapping("/moyenne/{idEtudiant}")
    public ResponseEntity<Map<String, Object>> getMoyenne(@PathVariable Long idEtudiant) {
        return ResponseEntity.ok(noteService.calculateMoyenne(idEtudiant));
    }

    // ------------------------------------------------------
    // 🚀 STEP 4 — GET BULLETIN / RELEVÉ DATA
    // ------------------------------------------------------
    @GetMapping("/bulletin/{idEtudiant}")
    public ResponseEntity<Map<String, Object>> getBulletin(@PathVariable Long idEtudiant) {
        return ResponseEntity.ok(noteService.getBulletin(idEtudiant));
    }
}
