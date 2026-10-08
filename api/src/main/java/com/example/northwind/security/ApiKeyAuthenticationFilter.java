package com.example.northwind.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Authentifie la requête via un header "X-API-KEY: <clé>".
 * N'écrase pas une authentification JWT déjà posée par le filtre précédent.
 */
@RequiredArgsConstructor
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

    private static final String HEADER = "X-API-KEY";

    private final SecApiKeyRepository apiKeyRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String rawKey = request.getHeader(HEADER);
        boolean alreadyAuthenticated = SecurityContextHolder.getContext().getAuthentication() != null;

        if (rawKey != null && !rawKey.isBlank() && !alreadyAuthenticated) {
            String hash = ApiKeyHasher.hash(rawKey);
            apiKeyRepository.findByKeyHash(hash)
                    .filter(SecApiKey::isEnabled)
                    .filter(k -> k.getExpiresAt() == null || k.getExpiresAt().isAfter(LocalDateTime.now()))
                    .ifPresent(apiKey -> {
                        SecurityPrincipal principal = new SecurityPrincipal(
                                PrincipalType.API_KEY, apiKey.getId(), apiKey.getOwnerName(), null, null);
                        var authentication = new UsernamePasswordAuthenticationToken(principal, null, List.of());
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    });
        }
        chain.doFilter(request, response);
    }
}
