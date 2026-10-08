package com.example.northwind.security;

/**
 * Principal authentifié posé dans le SecurityContext par les filtres JWT / API Key.
 * L'autorisation par endpoint est gérée explicitement par EndpointAuthorizationFilter,
 * via les permissions du RÔLE (roleId) pour un utilisateur ; les clés API restent
 * gérées indépendamment (pas de notion de rôle). "role" porte le code (ex: "001"),
 * utilisé pour restreindre la zone /admin/** aux administrateurs.
 */
public record SecurityPrincipal(PrincipalType type, Long id, String name, Long roleId, String role) {
}
