package com.example.northwind.repository;

import com.example.northwind.entity.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer> {

    /** Recherche globale "contient" sur les colonnes texte (pagination côté serveur). */
    @Query("SELECT e FROM Orders e WHERE LOWER(e.customerid) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.shipname) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.shipaddress) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.shipcity) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.shipregion) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.shippostalcode) LIKE LOWER(CONCAT('%', :filter, '%')) OR LOWER(e.shipcountry) LIKE LOWER(CONCAT('%', :filter, '%'))")
    Page<Orders> search(@Param("filter") String filter, Pageable pageable);
}
