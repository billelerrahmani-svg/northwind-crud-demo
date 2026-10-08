package com.example.northwind.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.io.IOException;

/**
 * Écrit une réponse d'erreur RFC 7807 directement dans le flux de sortie.
 *
 * A utiliser à la place de HttpServletResponse.sendError() dans les filtres et
 * les points d'entrée de sécurité : sendError() délègue à un dispatch ERROR vers
 * /error, que la chaîne Spring Security réévalue alors que la requête n'est
 * justement pas authentifiée. Le statut d'origine est perdu et le client reçoit
 * 403 pour un jeton expiré, sans pouvoir distinguer session expirée et vrai refus
 * d'accès.
 */
public final class SecurityErrorWriter {

    private SecurityErrorWriter() {
    }

    public static void write(HttpServletResponse response, HttpStatus status, String detail)
            throws IOException {

        if (response.isCommitted()) {
            return;
        }

        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(
                "{\"type\":\"about:blank\",\"title\":\"" + escape(status.getReasonPhrase())
                        + "\",\"status\":" + status.value()
                        + ",\"detail\":\"" + escape(detail) + "\"}");
        response.flushBuffer();
    }

    private static String escape(String value) {
        return value == null ? "" : value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
