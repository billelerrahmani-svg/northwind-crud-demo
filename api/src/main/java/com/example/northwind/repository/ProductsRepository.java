package com.example.northwind.repository;

import com.example.northwind.entity.Products;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductsRepository extends JpaRepository<Products, Integer> {

    /** Recherche globale "contient" sur les colonnes texte (pagination côté serveur). */
    @Query("SELECT e FROM Products e WHERE LOWER(e.productname) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.quantityperunit) LIKE LOWER(CONCAT('%', :filter, '%'))")
    Page<Products> search(@Param("filter") String filter, Pageable pageable);
}
