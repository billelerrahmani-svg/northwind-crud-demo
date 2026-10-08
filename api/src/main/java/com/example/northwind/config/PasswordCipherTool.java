package com.example.northwind.config;

/**
 * Utilitaire en ligne de commande pour chiffrer un mot de passe de connexion
 * avant de le coller dans app.datasource.password-encrypted (application-{profil}.properties).
 *
 * La variable d'environnement DB_SECRET_KEY doit être définie AVANT
 * l'exécution (la même clé doit ensuite être définie sur le serveur cible,
 * pour que DataSourceConfig puisse déchiffrer au démarrage) :
 *
 *   export DB_SECRET_KEY=une-cle-secrete-longue-et-aleatoire
 *   mvn compile exec:java -Dexec.mainClass="com.example.northwind.config.PasswordCipherTool" -Dexec.args="MonMotDePasse"
 *
 * (ou lancez cette classe directement depuis votre IDE, avec le mot de
 * passe en argument de programme et DB_SECRET_KEY en variable d'environnement).
 */
public final class PasswordCipherTool {

    private PasswordCipherTool() {
    }

    public static void main(String[] args) {
        if (args.length != 1) {
            System.err.println("Usage : PasswordCipherTool <mot-de-passe-en-clair>");
            System.exit(1);
        }
        System.out.println(PasswordCipher.encrypt(args[0]));
    }
}
