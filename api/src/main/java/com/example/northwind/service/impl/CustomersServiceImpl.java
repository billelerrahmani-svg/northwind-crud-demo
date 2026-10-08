package com.example.northwind.service.impl;

import com.example.northwind.entity.Customers;
import com.example.northwind.repository.CustomersRepository;
import com.example.northwind.service.CustomersService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class CustomersServiceImpl implements CustomersService {

    private final CustomersRepository repository;

    public CustomersServiceImpl(CustomersRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Customers> findAll() {
        return repository.findAll();
    }

    @Override
    public Page<Customers> findPage(String filter, Pageable pageable) {
        if (filter == null || filter.isBlank()) {
            return repository.findAll(pageable);
        }
        return repository.search(filter.trim(), pageable);
    }

    @Override
    public Optional<Customers> findById(String id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Customers save(Customers entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public Customers update(String id, Customers entity) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Customers introuvable avec id: " + id);
        }
        entity.setCustomerid(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void deleteById(String id) {
        repository.deleteById(id);
    }
}
