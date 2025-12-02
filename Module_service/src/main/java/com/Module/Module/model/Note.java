package com.Module.Module.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "note")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id_note")
    @Column(name = "id_note")
    private Long idNote;

    @JsonProperty("id_etudiant")
    @Column(name = "id_etudiant", nullable = false)
    private Long idEtudiant;

    @JsonProperty("id_module")
    @Column(name = "id_module", nullable = false)
    private Long idModule;

    @Column(nullable = false)
    private double valeur;

    @Column(name = "session")
    private String session; // "normal" ou "rattrapage"

    // Constructeur par défaut (obligatoire pour JPA)
    public Note() {
    }

    // Constructeur avec paramètres
    public Note(Long idEtudiant, Long idModule, double valeur, String session) {
        this.idEtudiant = idEtudiant;
        this.idModule = idModule;
        this.valeur = valeur;
        this.session = session;
    }

    // Getters et Setters
    public Long getIdNote() {
        return idNote;
    }

    public void setIdNote(Long idNote) {
        this.idNote = idNote;
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

    public double getValeur() {
        return valeur;
    }

    public void setValeur(double valeur) {
        this.valeur = valeur;
    }

    public String getSession() {
        return session;
    }

    public void setSession(String session) {
        this.session = session;
    }

    @Override
    public String toString() {
        return "Note{" +
                "idNote=" + idNote +
                ", idEtudiant=" + idEtudiant +
                ", idModule=" + idModule +
                ", valeur=" + valeur +
                ", session='" + session + '\'' +
                '}';
    }
}