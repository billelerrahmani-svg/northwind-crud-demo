package com.example.northwind.repository;

import com.example.northwind.entity.Employees;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeesRepository extends JpaRepository<Employees, Integer> {

    /** Recherche globale "contient" sur les colonnes texte (pagination côté serveur). */
    @Query("SELECT e FROM Employees e WHERE LOWER(e.lastname) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.firstname) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.title) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.titleofcourtesy) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.address) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.city) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.region) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.postalcode) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.country) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.homephone) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.extension) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.notes) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.photopath) LIKE LOWER(CONCAT('%', :filter, '%'))")
    Page<Employees> search(@Param("filter") String filter, Pageable pageable);
}
