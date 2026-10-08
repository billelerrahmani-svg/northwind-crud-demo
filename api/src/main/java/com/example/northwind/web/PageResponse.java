package com.example.northwind.web;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Enveloppe de page au format JSON stable pour les endpoints paginés
 * (le PageImpl de Spring Data n'a pas de format de sérialisation garanti
 * d'une version à l'autre).
 */
public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages) {

    public static <T> PageResponse<T> of(Page<T> page) {
        return new PageResponse<>(page.getContent(), page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }
}
