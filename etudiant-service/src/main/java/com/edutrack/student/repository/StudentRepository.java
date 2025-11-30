package com.edutrack.student.repository;

import com.edutrack.student.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

      // Méthode pour rechercher un étudiant par matricule
      Optional<Student> findByMatricule(String matricule);
}
