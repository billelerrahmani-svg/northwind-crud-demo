package com.example.northwind.service;

import com.example.northwind.entity.Employees;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface EmployeesService {

    List<Employees> findAll();

    Page<Employees> findPage(String filter, Pageable pageable);

    Optional<Employees> findById(Integer id);

    Employees save(Employees entity);

    Employees update(Integer id, Employees entity);

    void deleteById(Integer id);
}
