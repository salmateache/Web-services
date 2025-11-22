package com.edutrack.student.controller;

import com.edutrack.student.model.Student;
import com.edutrack.student.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentRepository repository;

    public StudentController(StudentRepository repository) {
        this.repository = repository;
    }

    // Rechercher un étudiant par ID ou matricule
    @GetMapping("/search/{term}")
    public ResponseEntity<Student> getStudentByIdOrMatricule(@PathVariable String term) {
        try {
            Student student;
            if (term.matches("\\d+")) {
                student = repository.findById(Long.parseLong(term))
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant non trouvé"));
            } else {
                student = repository.findByMatricule(term)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant non trouvé"));
            }
            return ResponseEntity.ok(student);
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID invalide");
        }
    }

    // Récupérer tous les étudiants
    @GetMapping
    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    // Ajouter un étudiant
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return repository.save(student);
    }

    // Mettre à jour un étudiant
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student newStudent) {
        return repository.findById(id)
                .map(student -> {
                    student.setNom(newStudent.getNom());
                    student.setPrenom(newStudent.getPrenom());
                    student.setMatricule(newStudent.getMatricule());
                    student.setEmail(newStudent.getEmail());
                    return repository.save(student);
                })
                .orElseGet(() -> {
                    newStudent.setId(id);
                    return repository.save(newStudent);
                });
    }

    // Supprimer un étudiant
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant non trouvé");
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
