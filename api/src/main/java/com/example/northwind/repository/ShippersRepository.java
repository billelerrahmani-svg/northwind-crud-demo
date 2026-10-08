package com.example.northwind.repository;

import com.example.northwind.entity.Shippers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShippersRepository extends JpaRepository<Shippers, Integer> {

    /** Recherche globale "contient" sur les colonnes texte (pagination côté serveur). */
    @Query("SELECT e FROM Shippers e WHERE LOWER(e.companyname) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.phone) LIKE LOWER(CONCAT('%', :filter, '%'))")
    Page<Shippers> search(@Param("filter") String filter, Pageable pageable);
}
