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
import java.util.List;
import java.util.Map;

/** Authentifie la requête via un header "Authorization: Bearer <jwt>". */
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final SecUserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                Map<String, Object> claims = jwtService.parseAndValidate(header.substring(7));
                Long userId = ((Number) claims.get("uid")).longValue();
                String username = (String) claims.get("sub");

                userRepository.findById(userId)
                        .filter(SecUser::isEnabled)
                        .ifPresent(user -> {
                            Long roleId = user.getRole() != null ? user.getRole().getId() : null;
                            String role = user.getRole() != null ? user.getRole().getUserrole() : null;
                            SecurityPrincipal principal = new SecurityPrincipal(PrincipalType.USER, user.getId(), username, roleId, role);
                            var authentication = new UsernamePasswordAuthenticationToken(principal, null, List.of());
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        });
            } catch (Exception ex) {
                SecurityContextHolder.clearContext();
            }
        }
        chain.doFilter(request, response);
    }
}
