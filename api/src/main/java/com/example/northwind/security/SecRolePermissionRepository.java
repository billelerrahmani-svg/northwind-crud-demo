package com.example.northwind.security;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecRolePermissionRepository extends JpaRepository<SecRolePermission, Long> {

    // JOIN FETCH : l'endpoint associé est lu dans les filtres de sécurité, en dehors
    // de toute session Hibernate ouverte -> évite LazyInitializationException.
    @Query("SELECT p FROM SecRolePermission p JOIN FETCH p.endpoint WHERE p.role.id = :roleId")
    List<SecRolePermission> findByRoleId(@Param("roleId") Long roleId);
}
