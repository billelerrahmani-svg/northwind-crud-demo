package com.example.northwind.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * Génération/validation de JWT implémentée uniquement avec le JDK
 * (HMAC-SHA256 + Jackson, déjà présent via spring-boot-starter-web),
 * sans dépendance tierce (jjwt, etc.).
 */
@Service
public class JwtService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${security.jwt.secret}")
    private String secret;

    @Value("${security.jwt.expiration-minutes:120}")
    private long expirationMinutes;

    public String generateToken(Long userId, String username) {
        try {
            Map<String, Object> header = new HashMap<>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");

            long now = Instant.now().getEpochSecond();
            Map<String, Object> payload = new HashMap<>();
            payload.put("sub", username);
            payload.put("uid", userId);
            payload.put("iat", now);
            payload.put("exp", now + (expirationMinutes * 60));

            String headerB64 = encode(objectMapper.writeValueAsBytes(header));
            String payloadB64 = encode(objectMapper.writeValueAsBytes(payload));
            String signature = sign(headerB64 + "." + payloadB64);

            return headerB64 + "." + payloadB64 + "." + signature;
        } catch (Exception e) {
            throw new IllegalStateException("Impossible de générer le JWT", e);
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> parseAndValidate(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new SecurityException("Token malformé");
            }
            String expectedSignature = sign(parts[0] + "." + parts[1]);
            if (!MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.UTF_8),
                    parts[2].getBytes(StandardCharsets.UTF_8))) {
                throw new SecurityException("Signature invalide");
            }

            Map<String, Object> payload = objectMapper.readValue(decode(parts[1]), Map.class);
            long exp = ((Number) payload.get("exp")).longValue();
            if (Instant.now().getEpochSecond() > exp) {
                throw new SecurityException("Token expiré");
            }
            return payload;
        } catch (SecurityException e) {
            throw e;
        } catch (Exception e) {
            throw new SecurityException("Token invalide", e);
        }
    }

    private String sign(String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(raw);
    }

    private String encode(byte[] data) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(data);
    }

    private byte[] decode(String data) {
        return Base64.getUrlDecoder().decode(data);
    }
}
