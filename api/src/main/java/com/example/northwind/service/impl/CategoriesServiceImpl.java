package com.example.northwind.service.impl;

import com.example.northwind.entity.Categories;
import com.example.northwind.repository.CategoriesRepository;
import com.example.northwind.service.CategoriesService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class CategoriesServiceImpl implements CategoriesService {

    private final CategoriesRepository repository;

    public CategoriesServiceImpl(CategoriesRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Categories> findAll() {
        return repository.findAll();
    }

    @Override
    public Page<Categories> findPage(String filter, Pageable pageable) {
        if (filter == null || filter.isBlank()) {
            return repository.findAll(pageable);
        }
        return repository.search(filter.trim(), pageable);
    }

    @Override
    public Optional<Categories> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Categories save(Categories entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public Categories update(Integer id, Categories entity) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Categories introuvable avec id: " + id);
        }
        entity.setCategoryid(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
