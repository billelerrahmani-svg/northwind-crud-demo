package com.example.northwind.repository;

import com.example.northwind.entity.Suppliers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SuppliersRepository extends JpaRepository<Suppliers, Integer> {

    /** Recherche globale "contient" sur les colonnes texte (pagination côté serveur). */
    @Query("SELECT e FROM Suppliers e WHERE LOWER(e.companyname) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.contactname) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.contacttitle) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.address) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.city) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.region) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.postalcode) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.country) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.phone) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.fax) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.homepage) LIKE LOWER(CONCAT('%', :filter, '%'))")
    Page<Suppliers> search(@Param("filter") String filter, Pageable pageable);
}
