package com.Module.Module.service;

import com.Module.Module.model.Reclamation;
import com.Module.Module.repository.ReclamationRepository;
import com.Module.Module.repository.ModuleRepository; // 👈 Import nécessaire
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ReclamationService {
    
    // ✅ CORRIGÉ : Le champ doit être déclaré 'final'
    private final ReclamationRepository reclamationRepository;
    // ✅ CORRIGÉ : Le champ doit être déclaré 'final'
    private final ModuleRepository moduleRepository; 

    // ✅ CORRIGÉ : Mise à jour du constructeur pour injecter ModuleRepository
    public ReclamationService(ReclamationRepository reclamationRepository, ModuleRepository moduleRepository) {
        this.reclamationRepository = reclamationRepository;
        this.moduleRepository = moduleRepository; // Initialisation de la nouvelle dépendance
    }

    /**
     * Traite et soumet une nouvelle réclamation.
     */
    public Reclamation submitReclamation(Reclamation reclamation) {
        reclamation.setStatut("EN_ATTENTE");
        reclamation.setDateSoumission(LocalDateTime.now());
        
        return reclamationRepository.save(reclamation);
    }

    /**
     * Récupère toutes les réclamations (pour le dashboard Admin).
     */
    public List<Reclamation> getAllReclamations() {
        return reclamationRepository.findAll();
    }
    
    /**
     * Récupère les réclamations soumises par un étudiant spécifique.
     */
    public List<Reclamation> getReclamationsByEtudiant(Long idEtudiant) {
        return reclamationRepository.findByIdEtudiant(idEtudiant);
    }

    /**
     * ✅ NOUVELLE MÉTHODE : Récupère les réclamations liées aux modules d'un professeur.
     */
    public List<Reclamation> getReclamationsByProfesseur(Long idProf) {
        // 1. Trouver les IDs des modules enseignés par ce professeur (via ModuleRepository)
        List<Long> moduleIds = moduleRepository.findIdModuleByIdProf(idProf);
        
        // 2. Récupérer toutes les réclamations qui correspondent à ces modules
        return reclamationRepository.findByIdModuleIn(moduleIds);
    }
    
    /**
     * ✅ NOUVELLE MÉTHODE : Mettre à jour le statut d'une réclamation.
     */
    public Reclamation updateReclamationStatus(Long reclamationId, String newStatus) {
        Reclamation rec = reclamationRepository.findById(reclamationId)
            .orElseThrow(() -> new NoSuchElementException("Réclamation non trouvée avec l'ID: " + reclamationId));

        rec.setStatut(newStatus);
        return reclamationRepository.save(rec);
    }
}