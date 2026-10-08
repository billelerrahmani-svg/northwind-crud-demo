package com.example.northwind.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Gestion des utilisateurs (comptes JWT) : création, rôle, activation, réinitialisation de mot de passe. */
@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final SecUserRepository userRepository;
    private final SecRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public record UserView(Long id, String username, boolean enabled, Long roleId, String roleLabel) {
    }

    public record CreateUserRequest(String username, String password, Long roleId, boolean enabled) {
    }

    public record UpdateUserRequest(Long roleId, boolean enabled) {
    }

    public record ResetPasswordRequest(String newPassword) {
    }

    @GetMapping
    public List<UserView> list() {
        return userRepository.findAll().stream().map(this::toView).toList();
    }

    @PostMapping
    public UserView create(@RequestBody CreateUserRequest request) {
        SecUser user = new SecUser();
        user.setUsername(request.username());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setEnabled(request.enabled());
        if (request.roleId() != null) {
            roleRepository.findById(request.roleId()).ifPresent(user::setRole);
        }
        return toView(userRepository.save(user));
    }

    @PutMapping("/{id}")
    public UserView update(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        SecUser user = userRepository.findById(id).orElseThrow();
        user.setEnabled(request.enabled());
        if (request.roleId() != null) {
            roleRepository.findById(request.roleId()).ifPresent(user::setRole);
        } else {
            user.setRole(null);
        }
        return toView(userRepository.save(user));
    }

    /** Réinitialisation par un administrateur : pas de vérification de l'ancien mot de passe. */
    @PutMapping("/{id}/password")
    public void resetPassword(@PathVariable Long id, @RequestBody ResetPasswordRequest request) {
        SecUser user = userRepository.findById(id).orElseThrow();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    private UserView toView(SecUser user) {
        Long roleId = user.getRole() != null ? user.getRole().getId() : null;
        String roleLabel = user.getRole() != null ? user.getRole().getDesignation() : null;
        return new UserView(user.getId(), user.getUsername(), user.isEnabled(), roleId, roleLabel);
    }
}
