package com.example.northwind.service.impl;

import com.example.northwind.entity.Suppliers;
import com.example.northwind.repository.SuppliersRepository;
import com.example.northwind.service.SuppliersService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class SuppliersServiceImpl implements SuppliersService {

    private final SuppliersRepository repository;

    public SuppliersServiceImpl(SuppliersRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Suppliers> findAll() {
        return repository.findAll();
    }

    @Override
    public Page<Suppliers> findPage(String filter, Pageable pageable) {
        if (filter == null || filter.isBlank()) {
            return repository.findAll(pageable);
        }
        return repository.search(filter.trim(), pageable);
    }

    @Override
    public Optional<Suppliers> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Suppliers save(Suppliers entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public Suppliers update(Integer id, Suppliers entity) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Suppliers introuvable avec id: " + id);
        }
        entity.setSupplierid(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
