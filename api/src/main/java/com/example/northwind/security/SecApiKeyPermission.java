package com.example.northwind.security;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sec_api_key_permission",
       uniqueConstraints = @UniqueConstraint(columnNames = {"api_key_id", "endpoint_id"}))
@Getter
@Setter
public class SecApiKeyPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "api_key_id", nullable = false)
    private SecApiKey apiKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "endpoint_id", nullable = false)
    private SecEndpoint endpoint;

    @Enumerated(EnumType.STRING)
    @Column(name = "effect", nullable = false, length = 5)
    private PermissionEffect effect = PermissionEffect.ALLOW;
}
