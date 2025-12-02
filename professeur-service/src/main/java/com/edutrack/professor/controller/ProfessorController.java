package com.edutrack.professor.controller;

import com.edutrack.professor.model.Professor;
import com.edutrack.professor.service.ProfesseurService; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/professors") 
@CrossOrigin(origins = "http://localhost:5173") // Autorise React
public class ProfessorController {

    private final ProfesseurService service; 

    public ProfessorController(ProfesseurService service) {
        this.service = service;
    }

    // 1. Ajouter un prof
    @PostMapping
    public Professor add(@RequestBody Professor professeur) {
        return service.addProfesseur(professeur);
    }

    // 2. Liste des profs
    @GetMapping
    public List<Professor> list() {
        return service.getProfesseurs();
    }
    
    // 3. Prof par ID (C'est CELUI-CI qui est vital pour ModuleList.jsx)
    @GetMapping("/{id}")
    public Professor getById(@PathVariable Long id) {
        return service.getProfesseurById(id);
    }

    // 4. Mettre à jour
    @PutMapping("/{id}") 
    public Professor update(@PathVariable Long id, @RequestBody Professor professeur) {
        return service.updateProfesseur(id, professeur);
    }

    // 5. Supprimer
    @DeleteMapping("/{id}") 
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteProfesseur(id);
        return ResponseEntity.ok("Professeur supprimé avec succès."); 
    }
}