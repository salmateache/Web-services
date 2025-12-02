package com.edutrack.professor.service;

import com.edutrack.professor.model.Professor;
import java.util.List;

public interface ProfesseurService {
    
    Professor addProfesseur(Professor professeur);
    
    Professor updateProfesseur(Long id, Professor professeur);
    
    void deleteProfesseur(Long id);
    
    List<Professor> getProfesseurs();
    
    Professor getProfesseurById(Long id);

    // ❌ La ligne "assignModule" a été supprimée ici pour correspondre à l'implémentation
}