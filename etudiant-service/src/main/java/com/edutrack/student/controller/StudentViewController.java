package com.edutrack.student.controller;

import com.edutrack.student.repository.StudentRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/students")
public class StudentViewController {

      private final StudentRepository repo;

      public StudentViewController(StudentRepository repo) {
            this.repo = repo;
      }

      @GetMapping
      public String listStudents(Model model) {
            model.addAttribute("students", repo.findAll());
            return "students"; // correspond au fichier students.html dans templates/
      }
}
