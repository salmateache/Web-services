/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_module;

    private String nom_module;
    private String code_module;
    private int coefficient;
    private String semestre;

    @ManyToOne
    private Professeur professeur;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
    private List<Note> notes;

    // Getters et Setters
    public Long getId_module() { return id_module; }
    public void setId_module(Long id_module) { this.id_module = id_module; }

    public String getNom_module() { return nom_module; }
    public void setNom_module(String nom_module) { this.nom_module = nom_module; }

    public String getCode_module() { return code_module; }
    public void setCode_module(String code_module) { this.code_module = code_module; }

    public int getCoefficient() { return coefficient; }
    public void setCoefficient(int coefficient) { this.coefficient = coefficient; }

    public String getSemestre() { return semestre; }
    public void setSemestre(String semestre) { this.semestre = semestre; }

    public Professeur getProfesseur() { return professeur; }
    public void setProfesseur(Professeur professeur) { this.professeur = professeur; }

    public List<Note> getNotes() { return notes; }
    public void setNotes(List<Note> notes) { this.notes = notes; }
}
