package com.example.northwind.service.impl;

import com.example.northwind.entity.CurrentProductList;
import com.example.northwind.repository.CurrentProductListRepository;
import com.example.northwind.service.CurrentProductListService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/** Vue en base : lecture seule, pas de save/update/delete. */
@Service
public class CurrentProductListServiceImpl implements CurrentProductListService {

    private final CurrentProductListRepository repository;

    public CurrentProductListServiceImpl(CurrentProductListRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<CurrentProductList> findAll() {
        return repository.findAll();
    }

    @Override
    public Page<CurrentProductList> findPage(String filter, Pageable pageable) {
        if (filter == null || filter.isBlank()) {
            return repository.findAll(pageable);
        }
        return repository.search(filter.trim(), pageable);
    }

    @Override
    public Optional<CurrentProductList> findById(Integer id) {
        return repository.findById(id);
    }
}
