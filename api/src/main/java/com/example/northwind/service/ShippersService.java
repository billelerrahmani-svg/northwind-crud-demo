package com.example.northwind.service;

import com.example.northwind.entity.Shippers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ShippersService {

    List<Shippers> findAll();

    Page<Shippers> findPage(String filter, Pageable pageable);

    Optional<Shippers> findById(Integer id);

    Shippers save(Shippers entity);

    Shippers update(Integer id, Shippers entity);

    void deleteById(Integer id);
}
