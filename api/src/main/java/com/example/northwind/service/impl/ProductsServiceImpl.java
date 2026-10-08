package com.example.northwind.service.impl;

import com.example.northwind.entity.Products;
import com.example.northwind.repository.ProductsRepository;
import com.example.northwind.service.ProductsService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class ProductsServiceImpl implements ProductsService {

    private final ProductsRepository repository;

    public ProductsServiceImpl(ProductsRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Products> findAll() {
        return repository.findAll();
    }

    @Override
    public Page<Products> findPage(String filter, Pageable pageable) {
        if (filter == null || filter.isBlank()) {
            return repository.findAll(pageable);
        }
        return repository.search(filter.trim(), pageable);
    }

    @Override
    public Optional<Products> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Products save(Products entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public Products update(Integer id, Products entity) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Products introuvable avec id: " + id);
        }
        entity.setProductid(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
