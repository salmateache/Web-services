package com.edutrack.student.controller;

import com.edutrack.student.model.Student;
import com.edutrack.student.repository.StudentRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentRepository repository;

    public StudentController(StudentRepository repository) {
        this.repository = repository;
    }

    // Récupérer tous les étudiants
    @GetMapping
    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    // Récupérer un étudiant par ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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

    // Export Excel
    @GetMapping("/export")
    public void exportToExcel(HttpServletResponse response) throws IOException {
        response.setContentType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=etudiants.xlsx");

        List<Student> students = repository.findAll();

        XSSFWorkbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Étudiants");

        // Header
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("ID");
        header.createCell(1).setCellValue("Nom");
        header.createCell(2).setCellValue("Prénom");
        header.createCell(3).setCellValue("Matricule");
        header.createCell(4).setCellValue("Email");

        // Données
        int rowNum = 1;
        for (Student s : students) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(s.getId());
            row.createCell(1).setCellValue(s.getNom());
            row.createCell(2).setCellValue(s.getPrenom());
            row.createCell(3).setCellValue(s.getMatricule());
            row.createCell(4).setCellValue(s.getEmail());
        }

        workbook.write(response.getOutputStream());
        workbook.close();
    }
}
