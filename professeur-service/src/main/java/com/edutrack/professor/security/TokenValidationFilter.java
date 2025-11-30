package com.edutrack.professor.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Collections;
import java.util.List;

@Component
public class TokenValidationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String secretKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // 1. On cherche le header "Authorization"
        String header = request.getHeader("Authorization");

        // 2. On vérifie s'il commence par "Bearer "
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7); // On enlève "Bearer "
            try {
                // 3. On déchiffre le token avec la clé
                Key key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                String username = claims.getSubject();
                String role = claims.get("role", String.class);

                // 4. On crée l'identité pour Spring Security
                // On ajoute "ROLE_" devant car Spring Security adore ça
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        username, null, Collections.singletonList(authority));
                
                // 5. On enregistre l'utilisateur connecté dans le contexte
                SecurityContextHolder.getContext().setAuthentication(auth);
                
            } catch (Exception e) {
                // Si le token est faux ou expiré, on ne fait rien (l'utilisateur restera non connecté)
                System.out.println("Erreur JWT : " + e.getMessage());
            }
        }
        
        // On laisse passer la requête vers la suite (le contrôleur)
        filterChain.doFilter(request, response);
    }
}
