package com.example.northwind.security;

import java.util.Map;

/**
 * *** POINT D'EXTENSION PRINCIPAL ***
 *
 * Implémentez cette interface (bean @Primary) pour calculer des restrictions
 * métier additionnelles propres à l'utilisateur ou à la clé API en cours de
 * requête (ex: limiter aux données d'un clientId, d'une région...).
 *
 * Le Map<String,String> renvoyé est déposé dans SecurityRestrictionContext
 * pendant toute la durée de la requête, lisible depuis n'importe quel
 * Service ou Controller généré :
 *
 *   String clientId = SecurityRestrictionContext.get("clientId");
 */
public interface AccessRestrictionProvider {

    /**
     * @param principal l'utilisateur ou la clé API authentifié(e) pour la requête en cours
     * @return les restrictions à appliquer (clé métier -> valeur), jamais null
     */
    Map<String, String> resolveRestrictions(SecurityPrincipal principal);
}
