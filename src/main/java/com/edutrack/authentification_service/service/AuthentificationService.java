package com.edutrack.authentification_service.service;

import com.edutrack.authentification_service.entity.Utilisateur;
import com.edutrack.authentification_service.repository.UtilisateurRepository;
import com.edutrack.authentification_service.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class AuthentificationService {

    @Autowired private UtilisateurRepository utilisateurRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider jwtTokenProvider;

    public String signup(String username, String password, String role) {
        if (utilisateurRepository.existsByUsername(username)) {
            return "Nom d'utilisateur déjà utilisé.";
        }

        Utilisateur utilisateur = Utilisateur.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role(role)
                .build();

        utilisateurRepository.save(utilisateur);
        return "Utilisateur créé avec succès.";
    }

    public String login(String username, String password) {
        Optional<Utilisateur> userOpt = utilisateurRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            Utilisateur user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return "Login réussi " ;
            }
        }
        return "Identifiants incorrects.";
    }

    public boolean verifyToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }
}