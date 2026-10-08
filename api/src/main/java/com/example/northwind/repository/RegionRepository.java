package com.example.northwind.repository;

import com.example.northwind.entity.Region;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegionRepository extends JpaRepository<Region, Integer> {

    /** Recherche globale "contient" sur les colonnes texte (pagination côté serveur). */
    @Query("SELECT e FROM Region e WHERE LOWER(e.regiondescription) LIKE LOWER(CONCAT('%', :filter, '%'))")
    Page<Region> search(@Param("filter") String filter, Pageable pageable);
}
