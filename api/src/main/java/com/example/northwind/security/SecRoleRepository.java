package com.example.northwind.security;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SecRoleRepository extends JpaRepository<SecRole, Long> {
    Optional<SecRole> findByUserrole(String userrole);
}
