package com.edutrack.professor.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects; // Nécessaire si vous n'utilisez pas Lombok

@Entity
@Table(name = "professor")
public class Professor implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    private String nom;
    private String prenom;

    // Contrainte critique pour la BDD
    @Column(unique = true, nullable = false) 
    private String email; 
    
    private String specialite;
    private String grade;

    // Pour la fonctionnalité assignModule
    private Long moduleId; 

    // Constructeur vide requis par JPA
    public Professor() {}

    // Getters et Setters (indispensables si vous n'utilisez pas Lombok)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSpecialite() { return specialite; }
    public void setSpecialite(String specialite) { this.specialite = specialite; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public Long getModuleId() { return moduleId; }
    public void setModuleId(Long moduleId) { this.moduleId = moduleId; }
}