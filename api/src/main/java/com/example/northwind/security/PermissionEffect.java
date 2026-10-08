package com.example.northwind.security;

/** Effet d'une permission sur un endpoint. DENY est toujours prioritaire sur ALLOW. */
public enum PermissionEffect {
    ALLOW,
    DENY
}
