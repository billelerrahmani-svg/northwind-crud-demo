package com.example.northwind.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Configuration Spring Security générée : CORS (pour un client comme
 * l'interface Angular générée), puis JWT + API Key, puis autorisation
 * par endpoint, puis alimentation du contexte de restrictions
 * (voir AccessRestrictionProvider).
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtService jwtService;
    private final SecUserRepository userRepository;
    private final SecApiKeyRepository apiKeyRepository;
    private final SecRolePermissionRepository rolePermissionRepository;
    private final SecApiKeyPermissionRepository apiKeyPermissionRepository;
    private final AccessRestrictionProvider accessRestrictionProvider;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter(jwtService, userRepository);
        ApiKeyAuthenticationFilter apiKeyFilter = new ApiKeyAuthenticationFilter(apiKeyRepository);
        EndpointAuthorizationFilter authorizationFilter =
                new EndpointAuthorizationFilter(rolePermissionRepository, apiKeyPermissionRepository);
        RestrictionContextFilter restrictionFilter = new RestrictionContextFilter(accessRestrictionProvider);

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/login").permitAll()
                // Documentation OpenAPI (springdoc). À restreindre en production
                // si l'API n'est pas destinée à être explorée publiquement.
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                // Dispatch interne du conteneur : sans cette exemption, toute erreur
                // renvoyée par un filtre ou un contrôleur repasse par la chaîne de
                // sécurité sur /error et ressort en 403, masquant le statut réel.
                .requestMatchers("/error").permitAll()
                .anyRequest().authenticated()
            )
            // Sans point d'entrée explicite, Spring Security répond 403 à une requête
            // non authentifiée : le client ne peut plus distinguer une session expirée
            // (401 -> retour à l'écran de connexion) d'un refus d'accès (403).
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) ->
                        SecurityErrorWriter.write(response, HttpStatus.UNAUTHORIZED,
                                "Authentification requise"))
                .accessDeniedHandler((request, response, deniedException) ->
                        SecurityErrorWriter.write(response, HttpStatus.FORBIDDEN,
                                "Accès refusé"))
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(apiKeyFilter, JwtAuthenticationFilter.class)
            .addFilterAfter(authorizationFilter, ApiKeyAuthenticationFilter.class)
            .addFilterAfter(restrictionFilter, EndpointAuthorizationFilter.class);

        return http.build();
    }
}
