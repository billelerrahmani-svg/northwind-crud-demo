package com.example.northwind.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Endpoints d'authentification et de gestion de son propre compte. */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final SecUserRepository userRepository;
    private final SecRolePermissionRepository rolePermissionRepository;
    private final CredentialsValidator credentialsValidator;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public record LoginRequest(String username, String password) {
    }

    /** role : code du rôle (ex: "001"), pour piloter l'affichage côté client sans décoder le JWT. */
    public record LoginResponse(String token, String tokenType, String role) {
    }

    public record ChangePasswordRequest(String oldPassword, String newPassword) {
    }

    /** Endpoint autorisé (ALLOW), utilisé côté Angular pour savoir quels boutons afficher. */
    public record PermissionSummary(String httpMethod, String pathPattern) {
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        // Le compte applicatif est exigé dans tous les modes : c'est lui qui
        // porte le rôle, donc les autorisations.
        SecUser user = userRepository.findByUsername(request.username())
                .filter(SecUser::isEnabled)
                .orElseThrow(() -> new BadCredentialsException("Identifiants invalides"));

        if (!credentialsValidator.isValid(user, request.password())) {
            throw new BadCredentialsException("Identifiants invalides");
        }

        String token = jwtService.generateToken(user.getId(), user.getUsername());
        String role = user.getRole() != null ? user.getRole().getUserrole() : null;
        return new LoginResponse(token, "Bearer", role);
    }

    /** Changement de son propre mot de passe (ancien mot de passe requis). */
    @PutMapping("/me/password")
    public void changeOwnPassword(@RequestBody ChangePasswordRequest request) {
        SecurityPrincipal principal = (SecurityPrincipal) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        SecUser user = userRepository.findById(principal.id())
                .orElseThrow(() -> new BadCredentialsException("Utilisateur introuvable"));

        if (!credentialsValidator.isValid(user, request.oldPassword())) {
            throw new BadCredentialsException("Ancien mot de passe incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    /**
     * Endpoints ALLOW du rôle de l'utilisateur connecté : permet à l'interface
     * Angular de n'afficher les actions d'ajout/modification/suppression que
     * là où elles sont réellement permises, sans coder en dur de règle par rôle.
     */
    @GetMapping("/me/permissions")
    public List<PermissionSummary> myPermissions() {
        SecurityPrincipal principal = (SecurityPrincipal) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        if (principal.type() != PrincipalType.USER || principal.roleId() == null) {
            return List.of();
        }
        return rolePermissionRepository.findByRoleId(principal.roleId()).stream()
                .filter(p -> p.getEffect() == PermissionEffect.ALLOW)
                .map(p -> new PermissionSummary(p.getEndpoint().getHttpMethod(), p.getEndpoint().getPathPattern()))
                .toList();
    }
}
