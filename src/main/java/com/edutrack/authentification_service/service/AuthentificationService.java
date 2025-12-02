package com.edutrack.authentification_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.edutrack.authentification_service.entity.Utilisateur;
import com.edutrack.authentification_service.repository.UtilisateurRepository;
import com.edutrack.authentification_service.security.JwtTokenProvider;

@Service
public class AuthentificationService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Inscription d'un nouvel utilisateur
     */
    public String signup(String username, String password, String role) {
        // Vérification si l'utilisateur existe déjà
        if (utilisateurRepository.existsByUsername(username)) {
            throw new RuntimeException("Erreur: Nom d'utilisateur déjà pris !");
        }

        // Création de l'utilisateur avec mot de passe crypté
        Utilisateur user = Utilisateur.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role(role)
                .build();

        utilisateurRepository.save(user);
        return "Utilisateur enregistré avec succès";
    }

    /**
     * Connexion d'un utilisateur
     * @return Le Token JWT si les identifiants sont corrects
     */
    public String login(String username, String password) {
        // 1. Chercher l'utilisateur dans la BDD
        Utilisateur user = utilisateurRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // 2. Vérifier si le mot de passe correspond (comparaison du hash)
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        // 3. Générer et retourner le Token JWT
        return jwtTokenProvider.generateToken(user.getUsername(), user.getRole());
    }

    /**
     * Vérification de la validité d'un token
     */
    public boolean verifyToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }
    // AJOUTER CECI DANS LA CLASSE AuthentificationService

public void changePassword(String username, String oldPassword, String newPassword) {
    // 1. Chercher l'utilisateur
    Utilisateur user = utilisateurRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

    // 2. Vérifier l'ancien mot de passe
    if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
        throw new RuntimeException("Ancien mot de passe incorrect");
    }

    // 3. Sauvegarder le nouveau
    user.setPassword(passwordEncoder.encode(newPassword));
    utilisateurRepository.save(user);
}
}