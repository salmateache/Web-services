/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package entities;

import jakarta.persistence.*;

@Entity
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_role;

    private String nom_role;
    private String description;

    // Getters et Setters
    public Long getId_role() { return id_role; }
    public void setId_role(Long id_role) { this.id_role = id_role; }

    public String getNom_role() { return nom_role; }
    public void setNom_role(String nom_role) { this.nom_role = nom_role; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}