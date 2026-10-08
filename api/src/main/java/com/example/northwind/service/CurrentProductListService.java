package com.example.northwind.service;

import com.example.northwind.entity.CurrentProductList;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/** Vue en base : lecture seule, pas de save/update/delete. */
public interface CurrentProductListService {

    List<CurrentProductList> findAll();

    Page<CurrentProductList> findPage(String filter, Pageable pageable);

    Optional<CurrentProductList> findById(Integer id);
}
