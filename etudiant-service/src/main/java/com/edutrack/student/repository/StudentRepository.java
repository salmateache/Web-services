package com.edutrack.student.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.edutrack.student.model.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
    
    // Recherche globale : Nom OU Prénom OU Matricule
    List<Student> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCaseOrMatriculeContainingIgnoreCase(
        String nom, String prenom, String matricule
    );
}