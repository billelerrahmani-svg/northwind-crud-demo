package com.example.northwind.service.impl;

import com.example.northwind.entity.Employees;
import com.example.northwind.repository.EmployeesRepository;
import com.example.northwind.service.EmployeesService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class EmployeesServiceImpl implements EmployeesService {

    private final EmployeesRepository repository;

    public EmployeesServiceImpl(EmployeesRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Employees> findAll() {
        return repository.findAll();
    }

    @Override
    public Page<Employees> findPage(String filter, Pageable pageable) {
        if (filter == null || filter.isBlank()) {
            return repository.findAll(pageable);
        }
        return repository.search(filter.trim(), pageable);
    }

    @Override
    public Optional<Employees> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Employees save(Employees entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public Employees update(Integer id, Employees entity) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Employees introuvable avec id: " + id);
        }
        entity.setEmployeeid(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
