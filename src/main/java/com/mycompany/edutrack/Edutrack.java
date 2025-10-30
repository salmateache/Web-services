package com.mycompany.edutrack;

import entities.*;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import java.util.ArrayList;

public class Edutrack {
    public static void main(String[] args) {
        SessionFactory factory = new Configuration()
                .configure("hibernate.cfg.xml")
                .addAnnotatedClass(Etudiant.class)
                .addAnnotatedClass(Professeur.class)
                .addAnnotatedClass(entities.Module.class)
                .addAnnotatedClass(Note.class)
                .addAnnotatedClass(Role.class)
                .addAnnotatedClass(Authentification.class)
                .buildSessionFactory();

        Session session = factory.openSession();

        try {
            session.beginTransaction();

            // Création des rôles
            Role adminRole = new Role();
            adminRole.setNom_role("ADMIN");
            adminRole.setDescription("Administrateur du système");
            session.save(adminRole);

            // Création d'un utilisateur admin
            Authentification adminUser = new Authentification();
            adminUser.signup("admin", "admin123", adminRole);
            session.save(adminUser);

            // Création professeur
            Professeur prof = new Professeur();
            prof.setNom("Martin");
            prof.setPrenom("Claire");
            prof.setEmail("claire.martin@example.com");
            prof.setGrade("Maître");
            session.save(prof);

            // Création module
            entities.Module module = new entities.Module();
            module.setNom_module("Mathématiques");
            module.setCoefficient(3);
            module.setProfesseur(prof);
            session.save(module);

            // Création étudiant
            Etudiant etudiant = new Etudiant();
            etudiant.setNom("Dupont");
            etudiant.setPrenom("Jean");
            etudiant.setCNE("CNE123456");
            etudiant.setNiveau("Licence 1");
            etudiant.setNotes(new ArrayList<>());
            session.save(etudiant);

            // Création note
            Note note = new Note();
            note.setEtudiant(etudiant);
            note.setModule(module);
            note.setValeur(15.5);
            session.save(note);

            etudiant.getNotes().add(note);
            module.setNotes(new ArrayList<>());
            module.getNotes().add(note);

            session.getTransaction().commit();

            System.out.println("Données insérées avec succès !");
        } finally {
            session.close();
            factory.close();
        }
    }
}
