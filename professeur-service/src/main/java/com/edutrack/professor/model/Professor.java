package com.edutrack.professor.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "professor")
public class Professor implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    private String nom;
    private String prenom;

    @Column(unique = true, nullable = false) 
    private String email; 
    
    private String specialite;
    private String grade;

    // ❌ SUPPRIMÉ : private Long moduleId; 
    // On ne garde pas l'ID du module ici, c'est le module qui connait son prof.

    public Professor() {}

    public Professor(String nom, String prenom, String email, String specialite, String grade) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.specialite = specialite;
        this.grade = grade;
    }

    // Getters et Setters
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
}