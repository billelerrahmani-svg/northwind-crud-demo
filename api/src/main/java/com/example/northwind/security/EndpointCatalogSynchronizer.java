package com.example.northwind.security;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping;

import java.util.Map;

/**
 * Au démarrage de l'application générée, inventorie tous les endpoints
 * exposés et insère automatiquement ceux qui manquent dans sec_endpoint,
 * afin qu'ils soient immédiatement disponibles pour être assignés à des
 * utilisateurs ou clés API. N'écrase jamais un endpoint déjà catalogué.
 *
 * S'exécute avant SecurityBootstrap (voir @Order) pour que ce dernier
 * puisse accorder les permissions sur un catalogue à jour.
 */
@Component
@Order(1)
@RequiredArgsConstructor
public class EndpointCatalogSynchronizer implements CommandLineRunner {

    private final RequestMappingInfoHandlerMapping handlerMapping;
    private final SecEndpointRepository endpointRepository;

    @Override
    public void run(String... args) {
        Map<RequestMappingInfo, HandlerMethod> mappings = handlerMapping.getHandlerMethods();

        for (RequestMappingInfo info : mappings.keySet()) {
            var patterns = info.getPatternValues();
            var methods = info.getMethodsCondition().getMethods();

            for (String pattern : patterns) {
                // Endpoints publics (login) et documentation springdoc : hors du
                // catalogue des permissions, ils ne sont pas soumis à autorisation.
                if (pattern.equals("/auth/login")
                        || pattern.startsWith("/v3/api-docs")
                        || pattern.startsWith("/swagger-ui")) {
                    continue;
                }
                if (methods.isEmpty()) {
                    upsert("*", pattern);
                } else {
                    methods.forEach(m -> upsert(m.name(), pattern));
                }
            }
        }
    }

    private void upsert(String method, String pattern) {
        boolean exists = endpointRepository.findByHttpMethodAndPathPattern(method, pattern).isPresent();
        if (!exists) {
            SecEndpoint endpoint = new SecEndpoint();
            endpoint.setHttpMethod(method);
            endpoint.setPathPattern(pattern);
            endpoint.setDescription("Découvert automatiquement au démarrage");
            endpointRepository.save(endpoint);
        }
    }
}
