package com.example.northwind.repository;

import com.example.northwind.entity.Employeeterritories;
import com.example.northwind.entity.EmployeeterritoriesId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeterritoriesRepository extends JpaRepository<Employeeterritories, EmployeeterritoriesId> {

    /** Recherche globale "contient" sur les colonnes texte (pagination côté serveur). */
    @Query("SELECT e FROM Employeeterritories e WHERE LOWER(e.territoryid) LIKE LOWER(CONCAT('%', :filter, '%'))")
    Page<Employeeterritories> search(@Param("filter") String filter, Pageable pageable);
}
