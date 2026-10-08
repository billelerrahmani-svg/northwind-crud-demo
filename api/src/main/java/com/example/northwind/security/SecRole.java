package com.example.northwind.security;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Rôle fixe (3 valeurs) : 001 = Administrateur, 002 = Édition de données,
 * 003 = Consultation. Détermine la visibilité de la zone d'administration
 * et des actions d'ajout/modification/suppression côté interface Angular,
 * ainsi que la garde d'accès /admin/** côté API (EndpointAuthorizationFilter).
 */
@Entity
@Table(name = "sec_role")
@Getter
@Setter
public class SecRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "userrole", nullable = false, unique = true, length = 3)
    private String userrole;

    @Column(name = "designation", nullable = false, length = 255)
    private String designation;
}
