package com.example.northwind.web;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * Traduction centralisée des exceptions en réponses ProblemDetail (RFC 7807).
 * Sans elle, un identifiant inconnu ou une contrainte d'intégrité remonteraient
 * en 500 générique au lieu d'un statut HTTP exploitable par le client.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** Identifiant inexistant (update/getById sur un id inconnu) -> 404. */
    @ExceptionHandler(NoSuchElementException.class)
    public ProblemDetail handleNotFound(NoSuchElementException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND,
                ex.getMessage() != null ? ex.getMessage() : "Ressource introuvable");
    }

    /** Contrainte d'intégrité violée (ligne référencée par une FK, doublon d'unique...) -> 409. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleConflict(DataIntegrityViolationException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,
                "Opération impossible : contrainte d'intégrité violée "
                        + "(enregistrement référencé ailleurs ou doublon)");
    }

    /** Propriété de tri inconnue sur un endpoint paginé (?sort=xxx) -> 400. */
    @ExceptionHandler(PropertyReferenceException.class)
    public ProblemDetail handleBadSort(PropertyReferenceException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,
                "Paramètre de tri invalide : " + ex.getPropertyName());
    }

    /** Corps de requête rejeté par la Bean Validation (@Valid) -> 400 avec le détail par champ. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Données invalides");
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        problem.setProperty("errors", errors);
        return problem;
    }
}
