package com.example.northwind.service;

import com.example.northwind.entity.Categories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface CategoriesService {

    List<Categories> findAll();

    Page<Categories> findPage(String filter, Pageable pageable);

    Optional<Categories> findById(Integer id);

    Categories save(Categories entity);

    Categories update(Integer id, Categories entity);

    void deleteById(Integer id);
}
