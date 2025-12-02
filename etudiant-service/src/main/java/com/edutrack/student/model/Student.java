package com.edutrack.student.model;

import jakarta.persistence.*;

@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String prenom;
    private String matricule;
    private String email;

    // --- NOUVEAUX CHAMPS ---
    private String filiere;
    private String niveau;       // Ex: Licence, Master
    private Integer semestreActuel; // Ex: 1, 2, 3...

    // getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    // Getters/Setters Nouveaux Champs
    public String getFiliere() { return filiere; }
    public void setFiliere(String filiere) { this.filiere = filiere; }
    public String getNiveau() { return niveau; }
    public void setNiveau(String niveau) { this.niveau = niveau; }
    public Integer getSemestreActuel() { return semestreActuel; }
    public void setSemestreActuel(Integer semestreActuel) { this.semestreActuel = semestreActuel; }
}