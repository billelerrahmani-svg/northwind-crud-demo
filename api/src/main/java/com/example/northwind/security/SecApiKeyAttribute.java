package com.example.northwind.security;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/** Attribut libre clé/valeur attaché à une clé API, utilisé pour les restrictions métier. */
@Entity
@Table(name = "sec_api_key_attribute",
       uniqueConstraints = @UniqueConstraint(columnNames = {"api_key_id", "attr_key"}))
@Getter
@Setter
public class SecApiKeyAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "api_key_id", nullable = false)
    private SecApiKey apiKey;

    @Column(name = "attr_key", nullable = false, length = 100)
    private String attrKey;

    @Column(name = "attr_value", nullable = false, length = 500)
    private String attrValue;
}
