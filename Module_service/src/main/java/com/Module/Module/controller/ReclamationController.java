package com.Module.Module.controller;

import com.Module.Module.model.Reclamation;
import com.Module.Module.service.ReclamationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/reclamations")
@CrossOrigin(origins = "http://localhost:5173") // Autoriser le Frontend React
public class ReclamationController {
    
    private final ReclamationService reclamationService;

    public ReclamationController(ReclamationService reclamationService) {
        this.reclamationService = reclamationService;
    }

    /**
     * Endpoint pour la soumission d'une réclamation par l'étudiant.
     * @param reclamation Le motif de la réclamation avec ID étudiant et ID module.
     */
    @PostMapping
    public ResponseEntity<Reclamation> submit(@RequestBody Reclamation reclamation) {
        // Validation minimale
        if (reclamation.getMotif() == null || reclamation.getMotif().length() < 10) {
            // Un meilleur message d'erreur peut être renvoyé ici
            return ResponseEntity.badRequest().body(null); 
        }
        
        Reclamation submitted = reclamationService.submitReclamation(reclamation);
        return ResponseEntity.status(HttpStatus.CREATED).body(submitted);
    }
    
    /**
     * Récupère toutes les réclamations.
     */
    @GetMapping
    public ResponseEntity<List<Reclamation>> getAll() {
        return ResponseEntity.ok(reclamationService.getAllReclamations());
    }
    
    @GetMapping("/etudiant/{idEtudiant}")
    public ResponseEntity<List<Reclamation>> getReclamationsByEtudiant(@PathVariable Long idEtudiant) {
        List<Reclamation> reclamations = reclamationService.getReclamationsByEtudiant(idEtudiant);
        return ResponseEntity.ok(reclamations);
    }
    // ✅ NOUVEL ENDPOINT : Récupérer les réclamations pour un Professeur
    @GetMapping("/professeur/{idProf}")
    public ResponseEntity<List<Reclamation>> getReclamationsForProf(@PathVariable Long idProf) {
        List<Reclamation> reclamations = reclamationService.getReclamationsByProfesseur(idProf);
        return ResponseEntity.ok(reclamations);
    }
    
    // ✅ NOUVEL ENDPOINT : Mettre à jour le statut d'une réclamation (pour le traitement)
    @PutMapping("/{id}/status")
    public ResponseEntity<Reclamation> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        try {
            String newStatus; // Récupère le nouveau statut
            newStatus = statusUpdate.get("statut");
            Reclamation updatedRec = reclamationService.updateReclamationStatus(id, newStatus);
            return ResponseEntity.ok(updatedRec);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}