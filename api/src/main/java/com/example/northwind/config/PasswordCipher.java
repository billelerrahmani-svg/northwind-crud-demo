package com.example.northwind.config;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

/**
 * Chiffrement/déchiffrement AES du mot de passe de connexion à la base de
 * données. La clé secrète est lue depuis la variable d'environnement
 * DB_SECRET_KEY (jamais codée en dur ni committée dans un fichier de
 * configuration) : à définir sur chaque serveur/poste où l'application
 * tourne. Utilisez PasswordCipherTool pour générer la valeur chiffrée à
 * coller dans application-{profil}.properties (app.datasource.password-encrypted).
 */
public final class PasswordCipher {

    private static final String ENV_VAR = "DB_SECRET_KEY";
    private static final String ALGORITHM = "AES";

    private PasswordCipher() {
    }

    public static String encrypt(String rawPassword) {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey());
            byte[] encrypted = cipher.doFinal(rawPassword.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new IllegalStateException("Impossible de chiffrer le mot de passe", e);
        }
    }

    public static String decrypt(String encryptedPassword) {
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey());
            byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(encryptedPassword));
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Impossible de dechiffrer le mot de passe (DB_SECRET_KEY absente ou incorrecte ?)", e);
        }
    }

    // Dérive une clé AES-256 (32 octets) par hachage SHA-256 de la variable
    // d'environnement, quelle que soit sa longueur d'origine : évite les
    // erreurs de taille de clé AES (contrairement à un simple substring()).
    private static SecretKeySpec secretKey() throws Exception {
        String secret = System.getenv(ENV_VAR);
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("Variable d'environnement " + ENV_VAR + " manquante");
        }
        MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
        byte[] keyBytes = sha256.digest(secret.getBytes(StandardCharsets.UTF_8));
        return new SecretKeySpec(keyBytes, ALGORITHM);
    }
}
