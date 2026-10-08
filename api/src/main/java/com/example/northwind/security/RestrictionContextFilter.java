package com.example.northwind.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * S'exécute après EndpointAuthorizationFilter : appelle AccessRestrictionProvider
 * pour le principal courant et alimente SecurityRestrictionContext pour la
 * durée de la requête, puis le vide systématiquement.
 */
@RequiredArgsConstructor
public class RestrictionContextFilter extends OncePerRequestFilter {

    private final AccessRestrictionProvider accessRestrictionProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof SecurityPrincipal principal) {
                SecurityRestrictionContext.set(accessRestrictionProvider.resolveRestrictions(principal));
            }
            chain.doFilter(request, response);
        } finally {
            SecurityRestrictionContext.clear();
        }
    }
}
