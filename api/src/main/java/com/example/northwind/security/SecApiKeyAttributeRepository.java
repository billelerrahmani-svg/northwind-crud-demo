package com.example.northwind.security;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecApiKeyAttributeRepository extends JpaRepository<SecApiKeyAttribute, Long> {
    List<SecApiKeyAttribute> findByApiKeyId(Long apiKeyId);
}
