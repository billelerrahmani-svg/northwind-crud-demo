package com.example.northwind.repository;

import com.example.northwind.entity.Territories;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TerritoriesRepository extends JpaRepository<Territories, String> {

    /** Recherche globale "contient" sur les colonnes texte (pagination côté serveur). */
    @Query("SELECT e FROM Territories e WHERE LOWER(e.territoryid) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.territorydescription) LIKE LOWER(CONCAT('%', :filter, '%'))")
    Page<Territories> search(@Param("filter") String filter, Pageable pageable);
}
