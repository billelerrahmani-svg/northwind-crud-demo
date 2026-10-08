package com.example.northwind.security;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

/**
 * Rôles : les 3 rôles fixes (001/002/003) sont créés par SecurityBootstrap.
 * D'autres rôles peuvent être ajoutés librement depuis cet écran d'administration.
 */
@RestController
@RequestMapping("/admin/roles")
@RequiredArgsConstructor
public class AdminRoleController {

    private static final Set<String> BUILT_IN_ROLES = Set.of("001", "002", "003");

    private final SecRoleRepository roleRepository;
    private final SecUserRepository userRepository;

    public record CreateRoleRequest(String userrole, String designation) {
    }

    public record UpdateRoleRequest(String designation) {
    }

    @GetMapping
    public List<SecRole> list() {
        return roleRepository.findAll();
    }

    @PostMapping
    public SecRole create(@RequestBody CreateRoleRequest request) {
        SecRole role = new SecRole();
        role.setUserrole(request.userrole());
        role.setDesignation(request.designation());
        return roleRepository.save(role);
    }

    /** Seule la désignation est modifiable : le code (userrole) ne doit pas changer une fois attribué. */
    @PutMapping("/{id}")
    public SecRole update(@PathVariable Long id, @RequestBody UpdateRoleRequest request) {
        SecRole role = roleRepository.findById(id).orElseThrow();
        role.setDesignation(request.designation());
        return roleRepository.save(role);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        SecRole role = roleRepository.findById(id).orElseThrow();
        if (BUILT_IN_ROLES.contains(role.getUserrole())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Les rôles 001/002/003 ne peuvent pas être supprimés");
        }
        boolean inUse = userRepository.findAll().stream()
                .anyMatch(u -> u.getRole() != null && u.getRole().getId().equals(id));
        if (inUse) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ce rôle est encore attribué à au moins un utilisateur");
        }
        roleRepository.deleteById(id);
    }
}
