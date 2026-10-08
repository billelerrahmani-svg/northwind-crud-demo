package com.example.northwind.security;

/** Type de principal authentifié : utilisateur (token JWT) ou clé API. */
public enum PrincipalType {
    USER,
    API_KEY
}
