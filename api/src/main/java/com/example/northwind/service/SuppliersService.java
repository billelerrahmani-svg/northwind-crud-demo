package com.example.northwind.service;

import com.example.northwind.entity.Suppliers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface SuppliersService {

    List<Suppliers> findAll();

    Page<Suppliers> findPage(String filter, Pageable pageable);

    Optional<Suppliers> findById(Integer id);

    Suppliers save(Suppliers entity);

    Suppliers update(Integer id, Suppliers entity);

    void deleteById(Integer id);
}
