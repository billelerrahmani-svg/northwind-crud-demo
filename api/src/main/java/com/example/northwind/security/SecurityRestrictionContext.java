package com.example.northwind.security;

import java.util.Collections;
import java.util.Map;

/**
 * Porte les restrictions calculées par AccessRestrictionProvider pendant
 * toute la durée d'une requête HTTP, pour qu'un Service ou Controller
 * généré puisse les lire simplement : SecurityRestrictionContext.get("clientId")
 */
public final class SecurityRestrictionContext {

    private static final ThreadLocal<Map<String, String>> HOLDER = new ThreadLocal<>();

    private SecurityRestrictionContext() {
    }

    static void set(Map<String, String> restrictions) {
        HOLDER.set(restrictions);
    }

    public static Map<String, String> getAll() {
        Map<String, String> value = HOLDER.get();
        return value == null ? Collections.emptyMap() : value;
    }

    public static String get(String key) {
        return getAll().get(key);
    }

    static void clear() {
        HOLDER.remove();
    }
}
