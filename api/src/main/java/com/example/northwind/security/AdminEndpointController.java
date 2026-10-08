package com.example.northwind.security;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Catalogue des endpoints protégeables, utilisé pour construire la matrice de permissions. */
@RestController
@RequestMapping("/admin/endpoints")
@RequiredArgsConstructor
public class AdminEndpointController {

    private final SecEndpointRepository endpointRepository;

    @GetMapping
    public List<SecEndpoint> list() {
        return endpointRepository.findAll();
    }
}
