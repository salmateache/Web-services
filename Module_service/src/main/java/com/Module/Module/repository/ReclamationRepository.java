package com.Module.Module.repository;

import com.Module.Module.model.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    
    // Pour une éventuelle consultation des réclamations par étudiant
    List<Reclamation> findByIdEtudiant(Long idEtudiant);
    // ✅ AJOUT : Trouver les réclamations par une liste d'IDs de modules
    List<Reclamation> findByIdModuleIn(List<Long> idModules);
}