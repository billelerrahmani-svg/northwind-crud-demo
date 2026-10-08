package com.example.northwind.security;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecApiKeyPermissionRepository extends JpaRepository<SecApiKeyPermission, Long> {

    @Query("SELECT p FROM SecApiKeyPermission p JOIN FETCH p.endpoint WHERE p.apiKey.id = :apiKeyId")
    List<SecApiKeyPermission> findByApiKeyId(@Param("apiKeyId") Long apiKeyId);
}
