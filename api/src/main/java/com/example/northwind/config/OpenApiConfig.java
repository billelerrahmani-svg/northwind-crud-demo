package com.example.northwind.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Documentation OpenAPI générée par springdoc : interface interactive sur
 * /swagger-ui.html, spécification JSON sur /v3/api-docs (utilisable par
 * Postman, des générateurs de clients, etc.).
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI apiDocumentation() {
        OpenAPI api = new OpenAPI()
                .info(new Info().title("northwind-api API").version("v1"));

        // Bouton "Authorize" de Swagger UI : coller le JWT renvoyé par /auth/login.
        api.components(new Components().addSecuritySchemes("bearer",
                new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
        api.addSecurityItem(new SecurityRequirement().addList("bearer"));
        return api;
    }
}
