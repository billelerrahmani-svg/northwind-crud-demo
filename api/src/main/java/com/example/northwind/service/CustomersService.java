package com.example.northwind.service;

import com.example.northwind.entity.Customers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface CustomersService {

    List<Customers> findAll();

    Page<Customers> findPage(String filter, Pageable pageable);

    Optional<Customers> findById(String id);

    Customers save(Customers entity);

    Customers update(String id, Customers entity);

    void deleteById(String id);
}
