package com.example.northwind.security;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SecApiKeyRepository extends JpaRepository<SecApiKey, Long> {
    Optional<SecApiKey> findByKeyHash(String keyHash);
}
