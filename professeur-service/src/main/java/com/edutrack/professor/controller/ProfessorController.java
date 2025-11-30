package com.edutrack.professor.controller;

import com.edutrack.professor.model.Professor;
import com.edutrack.professor.service.ProfesseurService; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List; // 🚨 AJOUT CRITIQUE POUR COMPILATION

@RestController
@RequestMapping("/api/professors") 
// Assurez-vous que le port est bien 5173
@CrossOrigin(origins = "http://localhost:5173") 
public class ProfessorController {

    private final ProfesseurService service; 

    // Injection par constructeur
    public ProfessorController(ProfesseurService service) {
        this.service = service;
    }

    // --- FONCTIONNALITÉS CRUD ET MÉTIER ---

    // 1. POST (Ajout) : /api/professors
    @PostMapping
    public Professor add(@RequestBody Professor professeur) {
        return service.addProfesseur(professeur);
    }

    // 2. GET (Liste complète) : /api/professors
    @GetMapping
    public List<Professor> list() {
        return service.getProfesseurs();
    }
    
    // 3. GET (Par ID) : /api/professors/{id}
    @GetMapping("/{id}")
    public Professor getById(@PathVariable Long id) {
        return service.getProfesseurById(id);
    }

    // 4. PUT (Modification) : /api/professors/{id}
    @PutMapping("/{id}") 
    public Professor update(@PathVariable Long id, @RequestBody Professor professeur) {
        return service.updateProfesseur(id, professeur);
    }

    // 5. DELETE (Suppression) : /api/professors/{id}
    @DeleteMapping("/{id}") 
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.deleteProfesseur(id);
        // 🚨 CORRECTION : Ajout du retour ResponseEntity
        return ResponseEntity.ok("Professeur supprimé avec succès."); 
    }

    // 6. POST (Fonction métier : Assigner Module) : /api/professors/{idProf}/assign/{idModule}
    // Cette méthode a été ajoutée dans la section précédente.
    /*
    @PostMapping("/{idProf}/assign/{idModule}") 
    public Professor assignModule(@PathVariable Long idProf, @PathVariable Long idModule) {
        return service.assignModule(idProf, idModule);
    }
    */
}