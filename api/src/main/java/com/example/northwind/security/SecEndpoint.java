package com.example.northwind.security;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sec_endpoint",
       uniqueConstraints = @UniqueConstraint(columnNames = {"http_method", "path_pattern"}))
@Getter
@Setter
public class SecEndpoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** GET, POST, PUT, DELETE, ou "*" pour toutes les méthodes. */
    @Column(name = "http_method", nullable = false, length = 10)
    private String httpMethod;

    /** Pattern Ant, ex: /api/clients/** */
    @Column(name = "path_pattern", nullable = false, length = 300)
    private String pathPattern;

    @Column(name = "description", length = 300)
    private String description;
}
