package com.edutrack.professor.service;

import com.edutrack.professor.model.Professor;
import com.edutrack.professor.repository.ProfessorRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient; 
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProfesseurServiceImpl implements ProfesseurService {

    private final ProfessorRepository repository;
    private final WebClient.Builder webClientBuilder; 

    public ProfesseurServiceImpl(ProfessorRepository repository, WebClient.Builder webClientBuilder) {
        this.repository = repository;
        this.webClientBuilder = webClientBuilder; 
    }

    private Professor findByIdOrThrow(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Professeur non trouvé avec l'ID: " + id));
    }

    @Override
    public Professor addProfesseur(Professor professeur) { return repository.save(professeur); }

    @Override
    public Professor updateProfesseur(Long id, Professor professeurDetails) {
        Professor p = findByIdOrThrow(id);
        
        p.setNom(professeurDetails.getNom());
        p.setPrenom(professeurDetails.getPrenom());
        p.setEmail(professeurDetails.getEmail()); 
        p.setSpecialite(professeurDetails.getSpecialite());
        p.setGrade(professeurDetails.getGrade());
        
        return repository.save(p);
    }

    @Override
    public void deleteProfesseur(Long id) { findByIdOrThrow(id); repository.deleteById(id); }

    @Override
    public Professor getProfesseurById(Long id) { return findByIdOrThrow(id); }

    @Override
    public List<Professor> getProfesseurs() { return repository.findAll(); }

    @Override
    public Professor assignModule(Long idProf, Long idModule) {
        // Logique métier: Appel WebClient au Service Modules pour validation
        Professor p = findByIdOrThrow(idProf);
        p.setModuleId(idModule); 
        return repository.save(p);
    }
}