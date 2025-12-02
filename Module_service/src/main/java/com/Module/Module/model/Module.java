package com.Module.Module.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "module")
public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id_module")
    private Long idModule;

    @Column(name = "code_module", nullable = false, unique = true)
    @JsonProperty("code_module")
    private String codeModule;

    @Column(name = "nom_module", nullable = false)
    @JsonProperty("nom_module")
    private String nomModule;

    @Column(nullable = false)
    private int coefficient;

    @Column(nullable = false)
    private int semestre;

    @Column(name = "id_prof", nullable = true)
    @JsonProperty("id_prof")
    private Long idProf; // Optional link to Professor microservice

    public Module() {}

    public Module(String codeModule, String nomModule, int coefficient, int semestre, Long idProf) {
        this.codeModule = codeModule;
        this.nomModule = nomModule;
        this.coefficient = coefficient;
        this.semestre = semestre;
        this.idProf = idProf;
    }

    public Long getIdModule() {
        return idModule;
    }

    public void setIdModule(Long idModule) {
        this.idModule = idModule;
    }

    public String getCodeModule() {
        return codeModule;
    }

    public void setCodeModule(String codeModule) {
        this.codeModule = codeModule;
    }

    public String getNomModule() {
        return nomModule;
    }

    public void setNomModule(String nomModule) {
        this.nomModule = nomModule;
    }

    public int getCoefficient() {
        return coefficient;
    }

    public void setCoefficient(int coefficient) {
        this.coefficient = coefficient;
    }

    public int getSemestre() {
        return semestre;
    }

    public void setSemestre(int semestre) {
        this.semestre = semestre;
    }

    public Long getIdProf() {
        return idProf;
    }

    public void setIdProf(Long idProf) {
        this.idProf = idProf;
    }

    @Override
    public String toString() {
        return "Module{" +
                "idModule=" + idModule +
                ", codeModule='" + codeModule + '\'' +
                ", nomModule='" + nomModule + '\'' +
                ", coefficient=" + coefficient +
                ", semestre=" + semestre +
                ", idProf=" + idProf +
                '}';
    }
}
