package com.edutrack.authentification_service.controller;

import com.edutrack.authentification_service.dto.ChangePasswordRequest;
import com.edutrack.authentification_service.dto.LoginRequest;
import com.edutrack.authentification_service.dto.SignupRequest;
import com.edutrack.authentification_service.service.AuthentificationService;
import com.edutrack.authentification_service.security.JwtTokenProvider;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthentificationService authService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(
                authService.signup(request.getUsername(), request.getPassword(), request.getRole())
        );
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        // 1. Génération du token
        String token = authService.login(request.getUsername(), request.getPassword());

        // 2. Récupération du rôle depuis le token
        Claims claims = jwtTokenProvider.getClaims(token);
        String role = claims.get("role", String.class);

        // 3. Retourner le token + rôle
        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", role
        ));
    }

    @GetMapping("/verify")
    public ResponseEntity<Boolean> verify(@RequestParam String token) {
        return ResponseEntity.ok(authService.verifyToken(token));
    }
    // AJOUTER CECI DANS LA CLASSE AuthController

@PostMapping("/change-password")
public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
    try {
        authService.changePassword(request.getUsername(), request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Mot de passe modifié avec succès"));
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
}
}
