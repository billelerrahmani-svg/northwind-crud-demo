package com.example.northwind.security;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "sec_user")
@Getter
@Setter
public class SecUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // EAGER volontairement : le rôle est lu dans les filtres de sécurité
    // (hors session Hibernate), et la table sec_role est minuscule (3 lignes).
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private SecRole role;
}
