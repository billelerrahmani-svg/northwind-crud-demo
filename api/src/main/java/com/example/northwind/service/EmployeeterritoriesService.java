package com.example.northwind.service;

import com.example.northwind.entity.Employeeterritories;
import com.example.northwind.entity.EmployeeterritoriesId;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface EmployeeterritoriesService {

    List<Employeeterritories> findAll();

    Page<Employeeterritories> findPage(String filter, Pageable pageable);

    Optional<Employeeterritories> findById(EmployeeterritoriesId id);

    Employeeterritories save(Employeeterritories entity);

    Employeeterritories update(EmployeeterritoriesId id, Employeeterritories entity);

    void deleteById(EmployeeterritoriesId id);
}
