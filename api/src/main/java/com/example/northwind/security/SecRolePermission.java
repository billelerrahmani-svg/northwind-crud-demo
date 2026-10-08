package com.example.northwind.security;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/** Permissions ALLOW/DENY par (rôle, endpoint) : c'est le mécanisme central
 * d'autorisation pour les utilisateurs (les clés API restent gérées par
 * SecApiKeyPermission, qui n'a pas de notion de rôle). */
@Entity
@Table(name = "sec_role_permission",
       uniqueConstraints = @UniqueConstraint(columnNames = {"role_id", "endpoint_id"}))
@Getter
@Setter
public class SecRolePermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private SecRole role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "endpoint_id", nullable = false)
    private SecEndpoint endpoint;

    @Enumerated(EnumType.STRING)
    @Column(name = "effect", nullable = false, length = 5)
    private PermissionEffect effect = PermissionEffect.ALLOW;
}
