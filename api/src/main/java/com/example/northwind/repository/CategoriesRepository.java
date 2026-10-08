package com.example.northwind.repository;

import com.example.northwind.entity.Categories;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriesRepository extends JpaRepository<Categories, Integer> {

    /** Recherche globale "contient" sur les colonnes texte (pagination côté serveur). */
    @Query("SELECT e FROM Categories e WHERE LOWER(e.categoryname) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :filter, '%'))")
    Page<Categories> search(@Param("filter") String filter, Pageable pageable);
}
