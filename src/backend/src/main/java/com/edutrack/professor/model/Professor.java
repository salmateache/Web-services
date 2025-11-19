package com.edutrack.professor.model;

import jakarta.persistence.*;

@Entity
public class Professor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // id_prof

    private String nom;
    private String prenom;
    private String email;
    
    // Champs spécifiques demandés
    private String specialite;
    private String grade;

    // Constructeur vide requis par JPA
    public Professor() {}

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