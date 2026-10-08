package com.example.northwind.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Crée les 3 rôles fixes et un utilisateur administrateur (rôle 001) au
 * premier démarrage, et accorde ALLOW au RÔLE admin sur tous les endpoints
 * catalogués, afin qu'un client (ex: l'interface Angular générée) soit
 * utilisable immédiatement après la génération, sans étape SQL manuelle.
 *
 * S'exécute après EndpointCatalogSynchronizer pour que le catalogue soit à jour.
 * Désactivable via security.bootstrap.enabled=false (recommandé une fois vos
 * propres utilisateurs/rôles/permissions en place).
 */
@Component
@Order(10)
@RequiredArgsConstructor
public class SecurityBootstrap implements CommandLineRunner {

    /** Code, désignation. Modifiez ici si vos libellés doivent changer.
     * D'autres rôles peuvent être ajoutés ensuite depuis l'administration. */
    private static final String[][] FIXED_ROLES = {
            {"001", "Administrateur"},
            {"002", "Édition de données"},
            {"003", "Consultation"}
    };

    private final SecUserRepository userRepository;
    private final SecRoleRepository roleRepository;
    private final SecRolePermissionRepository rolePermissionRepository;
    private final SecEndpointRepository endpointRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${security.bootstrap.enabled:true}")
    private boolean enabled;

    @Value("${security.bootstrap.admin-username:admin}")
    private String adminUsername;

    @Value("${security.bootstrap.admin-password:admin}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (!enabled) {
            return;
        }

        for (String[] role : FIXED_ROLES) {
            if (roleRepository.findByUserrole(role[0]).isEmpty()) {
                SecRole r = new SecRole();
                r.setUserrole(role[0]);
                r.setDesignation(role[1]);
                roleRepository.save(r);
            }
        }
        SecRole adminRole = roleRepository.findByUserrole("001").orElseThrow();

        SecUser admin = userRepository.findByUsername(adminUsername).orElseGet(() -> {
            SecUser u = new SecUser();
            u.setUsername(adminUsername);
            u.setPasswordHash(passwordEncoder.encode(adminPassword));
            u.setEnabled(true);
            u.setRole(adminRole);
            return userRepository.save(u);
        });
        if (admin.getRole() == null) {
            admin.setRole(adminRole);
            userRepository.save(admin);
        }

        List<SecEndpoint> endpoints = endpointRepository.findAll();
        List<SecRolePermission> existing = rolePermissionRepository.findByRoleId(adminRole.getId());

        for (SecEndpoint endpoint : endpoints) {
            boolean alreadyGranted = existing.stream()
                    .anyMatch(p -> p.getEndpoint().getId().equals(endpoint.getId()));
            if (!alreadyGranted) {
                SecRolePermission perm = new SecRolePermission();
                perm.setRole(adminRole);
                perm.setEndpoint(endpoint);
                perm.setEffect(PermissionEffect.ALLOW);
                rolePermissionRepository.save(perm);
            }
        }
    }
}
