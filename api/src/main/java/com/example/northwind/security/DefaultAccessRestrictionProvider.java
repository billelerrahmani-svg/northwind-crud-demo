package com.example.northwind.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implémentation par défaut : lit les tables sec_user_attribute /
 * sec_api_key_attribute renseignées en base.
 *
 * *** PERSONNALISEZ ICI vos restrictions additionnelles ***
 * (ex: appel à un autre service, règles combinées, calcul dérivé...).
 * Ce fichier n'est jamais régénéré automatiquement une fois créé, afin de
 * préserver votre logique métier.
 */
@Component
@RequiredArgsConstructor
public class DefaultAccessRestrictionProvider implements AccessRestrictionProvider {

    private final SecUserAttributeRepository userAttributeRepository;
    private final SecApiKeyAttributeRepository apiKeyAttributeRepository;

    @Override
    public Map<String, String> resolveRestrictions(SecurityPrincipal principal) {
        if (principal.type() == PrincipalType.USER) {
            return userAttributeRepository.findByUserId(principal.id()).stream()
                    .collect(Collectors.toMap(SecUserAttribute::getAttrKey, SecUserAttribute::getAttrValue));
        } else {
            return apiKeyAttributeRepository.findByApiKeyId(principal.id()).stream()
                    .collect(Collectors.toMap(SecApiKeyAttribute::getAttrKey, SecApiKeyAttribute::getAttrValue));
        }
    }
}
