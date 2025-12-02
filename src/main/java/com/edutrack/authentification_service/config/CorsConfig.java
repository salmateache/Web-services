package com.edutrack.authentification_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Appliquer à TOUTES les routes
                        .allowedOrigins("http://localhost:5173") // Autoriser le Frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // OPTIONS est CRUCIAL !
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}