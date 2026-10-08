package com.example.northwind.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Authentification par mot de passe stocké (BCrypt) dans sec_user.password_hash. */
@Component
@RequiredArgsConstructor
public class DatabaseCredentialsValidator implements CredentialsValidator {

    private final PasswordEncoder passwordEncoder;

    @Override
    public boolean isValid(SecUser user, String password) {
        if (password == null || password.isEmpty()) {
            return false;
        }
        return passwordEncoder.matches(password, user.getPasswordHash());
    }
}
