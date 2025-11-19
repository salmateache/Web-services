package main.java.com.edutrack.professor.controller; // <--- C'est ici que c'était faux

import com.edutrack.professor.model.Professor;
import com.edutrack.professor.repository.ProfessorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professors")
@CrossOrigin(origins = "http://localhost:5174") // Très bien, c'est le bon port frontend
public class ProfessorController {

    private final ProfessorRepository repository;

    public ProfessorController(ProfessorRepository repository) {
        this.repository = repository;
    }

    // GET : Récupérer tous les professeurs
    @GetMapping
    public List<Professor> getProfessors() {
        return repository.findAll();
    }

    // POST : Ajouter un professeur
    @PostMapping
    public Professor addProfessor(@RequestBody Professor professor) {
        return repository.save(professor);
    }
}