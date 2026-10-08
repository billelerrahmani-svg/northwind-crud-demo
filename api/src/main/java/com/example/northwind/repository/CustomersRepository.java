package com.example.northwind.repository;

import com.example.northwind.entity.Customers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomersRepository extends JpaRepository<Customers, String> {

    /** Recherche globale "contient" sur les colonnes texte (pagination côté serveur). */
    @Query("SELECT e FROM Customers e WHERE LOWER(e.customerid) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.companyname) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.contactname) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.contacttitle) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.address) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.city) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.region) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.postalcode) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.country) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.phone) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.fax) LIKE LOWER(CONCAT('%', :filter, '%'))")
    Page<Customers> search(@Param("filter") String filter, Pageable pageable);
}
