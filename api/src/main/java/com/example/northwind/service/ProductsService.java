package com.example.northwind.service;

import com.example.northwind.entity.Products;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ProductsService {

    List<Products> findAll();

    Page<Products> findPage(String filter, Pageable pageable);

    Optional<Products> findById(Integer id);

    Products save(Products entity);

    Products update(Integer id, Products entity);

    void deleteById(Integer id);
}
