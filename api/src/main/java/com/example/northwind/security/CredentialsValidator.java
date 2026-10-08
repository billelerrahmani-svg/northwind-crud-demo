package com.example.northwind.security;

/**
 * Valide un couple utilisateur/mot de passe.
 *
 * L'implémentation active dépend du mode d'authentification choisi à la
 * génération : DatabaseCredentialsValidator (BCrypt sur sec_user) ou
 * LdapCredentialsValidator (bind Active Directory).
 *
 * Dans les deux cas, l'authentification ne donne aucun droit par elle-même :
 * le compte doit exister dans sec_user et son rôle porte les autorisations
 * (voir EndpointAuthorizationFilter).
 */
public interface CredentialsValidator {

    /**
     * @param user     compte applicatif correspondant (déjà chargé depuis sec_user)
     * @param password mot de passe présenté
     * @return true si les identifiants sont valides
     */
    boolean isValid(SecUser user, String password);
}
