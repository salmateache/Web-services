package com.edutrack.professor.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final TokenValidationFilter tokenValidationFilter;

    public SecurityConfig(TokenValidationFilter tokenValidationFilter) {
        this.tokenValidationFilter = tokenValidationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Pas besoin de CSRF en API REST
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Pas de session serveur
            .authorizeHttpRequests(auth -> auth
                // ICI ON DÉFINIT QUI A LE DROIT DE FAIRE QUOI
                
                // Exemple : Tout le monde (même non connecté) peut voir la liste (optionnel)
                // .requestMatchers("/professeurs/public").permitAll()

                // Exemple : Seul l'ADMIN peut ajouter/modifier un prof
                // .requestMatchers(HttpMethod.POST, "/professeurs/**").hasRole("ADMINISTRATEUR")
                
                // Règle générale : Il faut être authentifié (avoir un Token valide) pour tout le reste
                .anyRequest().authenticated()
            )
            // On branche notre filtre JWT avant que Spring ne vérifie le mot de passe
            .addFilterBefore(tokenValidationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}