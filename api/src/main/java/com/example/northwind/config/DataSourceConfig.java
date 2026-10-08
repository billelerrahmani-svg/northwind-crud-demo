package com.example.northwind.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * Construit la source de données à partir des propriétés app.datasource.*
 * du profil Spring actif (application-dev.properties, application-prod.properties,
 * application-formation.properties...), en déchiffrant le mot de passe via
 * PasswordCipher. Remplace la configuration standard spring.datasource.* afin
 * qu'aucun mot de passe ne soit jamais stocké en clair dans un fichier versionné.
 *
 * Profil actif sélectionné via spring.profiles.active (application.properties),
 * ou surchargé sans toucher au fichier via la variable d'environnement
 * SPRING_PROFILES_ACTIVE (pratique pour un même livrable déployé sur plusieurs
 * environnements : dev, prod, formation...).
 */
@Configuration
public class DataSourceConfig {

    @Value("${app.datasource.url}")
    private String url;

    @Value("${app.datasource.username}")
    private String username;

    @Value("${app.datasource.password-encrypted}")
    private String encryptedPassword;

    @Value("${app.datasource.driver-class-name:com.microsoft.sqlserver.jdbc.SQLServerDriver}")
    private String driverClassName;

    @Bean
    public DataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(PasswordCipher.decrypt(encryptedPassword));
        dataSource.setDriverClassName(driverClassName);
        return dataSource;
    }
}
