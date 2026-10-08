package com.example.northwind.security;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

/** Gestion des clés API : création (clé en clair renvoyée une seule fois), révocation, permissions. */
@RestController
@RequestMapping("/admin/api-keys")
@RequiredArgsConstructor
public class AdminApiKeyController {

    private final SecApiKeyRepository apiKeyRepository;
    private final SecEndpointRepository endpointRepository;
    private final SecApiKeyPermissionRepository permissionRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public record ApiKeyView(Long id, String keyPrefix, String ownerName, String description,
                              boolean enabled, LocalDateTime expiresAt) {
    }

    /** rawKey n'est présent que dans la réponse de création : il n'est jamais stocké ni récupérable ensuite. */
    public record ApiKeyCreated(Long id, String rawKey, String keyPrefix) {
    }

    public record CreateApiKeyRequest(String ownerName, String description, LocalDateTime expiresAt) {
    }

    public record UpdateApiKeyRequest(String description, boolean enabled, LocalDateTime expiresAt) {
    }

    public record PermissionView(Long endpointId, String httpMethod, String pathPattern, String effect) {
    }

    public record PermissionUpdate(Long endpointId, String effect) {
    }

    @GetMapping
    public List<ApiKeyView> list() {
        return apiKeyRepository.findAll().stream().map(this::toView).toList();
    }

    @PostMapping
    public ApiKeyCreated create(@RequestBody CreateApiKeyRequest request) {
        String rawKey = generateRawKey();
        String prefix = "ak_" + rawKey.substring(0, 8);

        SecApiKey apiKey = new SecApiKey();
        apiKey.setKeyPrefix(prefix);
        apiKey.setKeyHash(ApiKeyHasher.hash(rawKey));
        apiKey.setOwnerName(request.ownerName());
        apiKey.setDescription(request.description());
        apiKey.setEnabled(true);
        apiKey.setExpiresAt(request.expiresAt());
        SecApiKey saved = apiKeyRepository.save(apiKey);

        return new ApiKeyCreated(saved.getId(), rawKey, prefix);
    }

    @PutMapping("/{id}")
    public ApiKeyView update(@PathVariable Long id, @RequestBody UpdateApiKeyRequest request) {
        SecApiKey apiKey = apiKeyRepository.findById(id).orElseThrow();
        apiKey.setDescription(request.description());
        apiKey.setEnabled(request.enabled());
        apiKey.setExpiresAt(request.expiresAt());
        return toView(apiKeyRepository.save(apiKey));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        apiKeyRepository.deleteById(id);
    }

    @GetMapping("/{id}/permissions")
    public List<PermissionView> listPermissions(@PathVariable Long id) {
        List<SecApiKeyPermission> granted = permissionRepository.findByApiKeyId(id);
        return endpointRepository.findAll().stream()
                .map(endpoint -> {
                    String effect = granted.stream()
                            .filter(p -> p.getEndpoint().getId().equals(endpoint.getId()))
                            .map(p -> p.getEffect().name())
                            .findFirst()
                            .orElse(null);
                    return new PermissionView(endpoint.getId(), endpoint.getHttpMethod(),
                            endpoint.getPathPattern(), effect);
                })
                .toList();
    }

    @PutMapping("/{id}/permissions")
    public void replacePermissions(@PathVariable Long id, @RequestBody List<PermissionUpdate> updates) {
        SecApiKey apiKey = apiKeyRepository.findById(id).orElseThrow();
        permissionRepository.deleteAll(permissionRepository.findByApiKeyId(id));

        for (PermissionUpdate update : updates) {
            if (update.effect() == null) continue;
            SecEndpoint endpoint = endpointRepository.findById(update.endpointId()).orElseThrow();
            SecApiKeyPermission perm = new SecApiKeyPermission();
            perm.setApiKey(apiKey);
            perm.setEndpoint(endpoint);
            perm.setEffect(PermissionEffect.valueOf(update.effect()));
            permissionRepository.save(perm);
        }
    }

    private String generateRawKey() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private ApiKeyView toView(SecApiKey k) {
        return new ApiKeyView(k.getId(), k.getKeyPrefix(), k.getOwnerName(), k.getDescription(),
                k.isEnabled(), k.getExpiresAt());
    }
}
