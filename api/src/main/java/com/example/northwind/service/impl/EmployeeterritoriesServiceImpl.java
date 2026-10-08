package com.example.northwind.service.impl;

import com.example.northwind.entity.Employeeterritories;
import com.example.northwind.entity.EmployeeterritoriesId;
import com.example.northwind.repository.EmployeeterritoriesRepository;
import com.example.northwind.service.EmployeeterritoriesService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class EmployeeterritoriesServiceImpl implements EmployeeterritoriesService {

    private final EmployeeterritoriesRepository repository;

    public EmployeeterritoriesServiceImpl(EmployeeterritoriesRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Employeeterritories> findAll() {
        return repository.findAll();
    }

    @Override
    public Page<Employeeterritories> findPage(String filter, Pageable pageable) {
        if (filter == null || filter.isBlank()) {
            return repository.findAll(pageable);
        }
        return repository.search(filter.trim(), pageable);
    }

    @Override
    public Optional<Employeeterritories> findById(EmployeeterritoriesId id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Employeeterritories save(Employeeterritories entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public Employeeterritories update(EmployeeterritoriesId id, Employeeterritories entity) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Employeeterritories introuvable avec id: " + id);
        }
        entity.setEmployeeid(id.getEmployeeid());
        entity.setTerritoryid(id.getTerritoryid());
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void deleteById(EmployeeterritoriesId id) {
        repository.deleteById(id);
    }
}
