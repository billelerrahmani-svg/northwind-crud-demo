package com.example.northwind.security;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecUserAttributeRepository extends JpaRepository<SecUserAttribute, Long> {
    List<SecUserAttribute> findByUserId(Long userId);
}
