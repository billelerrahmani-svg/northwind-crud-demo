package com.example.northwind.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Autorise ou refuse la requête selon les permissions déclarées en base pour
 * l'utilisateur (token) ou la clé API authentifiée.
 *
 * Politique par défaut : REFUS (deny-by-default). DENY est toujours prioritaire
 * sur ALLOW, ce qui permet d'exclure un cas particulier au sein d'un pattern
 * plus large par ailleurs autorisé.
 */
@RequiredArgsConstructor
public class EndpointAuthorizationFilter extends OncePerRequestFilter {

    private final SecRolePermissionRepository rolePermissionRepository;
    private final SecApiKeyPermissionRepository apiKeyPermissionRepository;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    /** Endpoints publics, exemptés (Spring Security les gère déjà via permitAll,
     * mais ce filtre Servlet s'exécute avant et doit donc les ignorer explicitement). */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return "/auth/login".equals(uri)
                || uri.startsWith("/v3/api-docs")
                || uri.startsWith("/swagger-ui")
                || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!(auth != null && auth.getPrincipal() instanceof SecurityPrincipal principal)) {
            // 401 explicite : jeton absent, invalide ou expiré. Le client doit
            // pouvoir le distinguer d'un refus d'accès pour repartir à l'écran
            // de connexion (voir SecurityErrorWriter).
            SecurityErrorWriter.write(response, HttpStatus.UNAUTHORIZED, "Authentification requise");
            return;
        }

        String method = request.getMethod();
        String path = request.getRequestURI();

        // Garde-fou dédié : la zone d'administration n'est jamais accessible sans le
        // rôle 001, quelles que soient les permissions ALLOW éventuellement accordées.
        if (path.startsWith("/admin/") && !"001".equals(principal.role())) {
            SecurityErrorWriter.write(response, HttpStatus.FORBIDDEN, "Réservé aux administrateurs");
            return;
        }

        // Self-service : tout utilisateur authentifié peut consulter ses propres
        // permissions et changer son propre mot de passe, sans permission explicite.
        if ("/auth/me/password".equals(path) || "/auth/me/permissions".equals(path)) {
            chain.doFilter(request, response);
            return;
        }

        boolean allowed = false;
        boolean denied = false;

        if (principal.type() == PrincipalType.USER) {
            if (principal.roleId() != null) {
                List<SecRolePermission> perms = rolePermissionRepository.findByRoleId(principal.roleId());
                for (SecRolePermission p : perms) {
                    if (matches(p.getEndpoint(), method, path)) {
                        if (p.getEffect() == PermissionEffect.DENY) denied = true;
                        else allowed = true;
                    }
                }
            }
        } else {
            List<SecApiKeyPermission> perms = apiKeyPermissionRepository.findByApiKeyId(principal.id());
            for (SecApiKeyPermission p : perms) {
                if (matches(p.getEndpoint(), method, path)) {
                    if (p.getEffect() == PermissionEffect.DENY) denied = true;
                    else allowed = true;
                }
            }
        }

        if (!allowed || denied) {
            SecurityErrorWriter.write(response, HttpStatus.FORBIDDEN, "Accès refusé à cet endpoint");
            return;
        }

        chain.doFilter(request, response);
    }

    private boolean matches(SecEndpoint endpoint, String method, String path) {
        boolean methodOk = "*".equals(endpoint.getHttpMethod()) || endpoint.getHttpMethod().equalsIgnoreCase(method);
        return methodOk && pathMatcher.match(endpoint.getPathPattern(), path);
    }
}
