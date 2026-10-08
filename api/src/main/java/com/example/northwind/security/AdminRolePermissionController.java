package com.example.northwind.security;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Attribution des permissions ALLOW/DENY par endpoint, pour un rôle donné. */
@RestController
@RequestMapping("/admin/roles/{roleId}/permissions")
@RequiredArgsConstructor
public class AdminRolePermissionController {

    private final SecRoleRepository roleRepository;
    private final SecEndpointRepository endpointRepository;
    private final SecRolePermissionRepository permissionRepository;

    public record PermissionView(Long endpointId, String httpMethod, String pathPattern, String effect) {
    }

    public record PermissionUpdate(Long endpointId, String effect) {
    }

    @GetMapping
    public List<PermissionView> list(@PathVariable Long roleId) {
        List<SecRolePermission> granted = permissionRepository.findByRoleId(roleId);
        return endpointRepository.findAll().stream()
                .map(endpoint -> {
                    String effect = granted.stream()
                            .filter(p -> p.getEndpoint().getId().equals(endpoint.getId()))
                            .map(p -> p.getEffect().name())
                            .findFirst()
                            .orElse(null);
                    return new PermissionView(endpoint.getId(), endpoint.getHttpMethod(),
                            endpoint.getPathPattern(), effect);
                })
                .toList();
    }

    /** Remplace entièrement les permissions du rôle par la liste fournie. */
    @PutMapping
    public void replaceAll(@PathVariable Long roleId, @RequestBody List<PermissionUpdate> updates) {
        SecRole role = roleRepository.findById(roleId).orElseThrow();
        List<SecRolePermission> existing = permissionRepository.findByRoleId(roleId);
        permissionRepository.deleteAll(existing);

        for (PermissionUpdate update : updates) {
            if (update.effect() == null) continue; // pas de ligne = pas de permission (deny-by-default)
            SecEndpoint endpoint = endpointRepository.findById(update.endpointId()).orElseThrow();
            SecRolePermission perm = new SecRolePermission();
            perm.setRole(role);
            perm.setEndpoint(endpoint);
            perm.setEffect(PermissionEffect.valueOf(update.effect()));
            permissionRepository.save(perm);
        }
    }
}
