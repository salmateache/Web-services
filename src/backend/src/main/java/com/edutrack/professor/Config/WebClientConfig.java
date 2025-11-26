// Fichier : src/main/java/com/edutrack/professor/Config/WebClientConfig.java

// 🚨 CORRECTION CRITIQUE : Le package doit être 'Config' pour correspondre au dossier.
package com.edutrack.professor.Config; 

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient; 

// ... (le reste du code est correct)

@Configuration 
public class WebClientConfig {
    @Bean
    // @LoadBalanced 
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder(); 
    }
}