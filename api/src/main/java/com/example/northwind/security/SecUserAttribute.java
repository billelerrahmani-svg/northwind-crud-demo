package com.example.northwind.security;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/** Attribut libre clé/valeur attaché à un utilisateur, utilisé pour les restrictions métier. */
@Entity
@Table(name = "sec_user_attribute",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "attr_key"}))
@Getter
@Setter
public class SecUserAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private SecUser user;

    @Column(name = "attr_key", nullable = false, length = 100)
    private String attrKey;

    @Column(name = "attr_value", nullable = false, length = 500)
    private String attrValue;
}
