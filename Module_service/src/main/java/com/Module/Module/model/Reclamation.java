package com.Module.Module.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity
public class Reclamation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Identifiants pour le lien avec les autres services/tables
    private Long idEtudiant;
    private Long idModule;
    private String motif;
    private String statut; 
    private LocalDateTime dateSoumission;

    // Constructeur par défaut requis par JPA
    public Reclamation() {}

    // Constructeur complet (pour la facilité d'utilisation dans le Service)
    public Reclamation(Long idEtudiant, Long idModule, String motif, String statut, LocalDateTime dateSoumission) {
        this.idEtudiant = idEtudiant;
        this.idModule = idModule;
        this.motif = motif;
        this.statut = statut;
        this.dateSoumission = dateSoumission;
    }

    // --- Getters et Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdEtudiant() {
        return idEtudiant;
    }

    public void setIdEtudiant(Long idEtudiant) {
        this.idEtudiant = idEtudiant;
    }

    public Long getIdModule() {
        return idModule;
    }

    public void setIdModule(Long idModule) {
        this.idModule = idModule;
    }

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public LocalDateTime getDateSoumission() {
        return dateSoumission;
    }

    public void setDateSoumission(LocalDateTime dateSoumission) {
        this.dateSoumission = dateSoumission;
    }
}