package com.example.northwind.service.impl;

import com.example.northwind.entity.Shippers;
import com.example.northwind.repository.ShippersRepository;
import com.example.northwind.service.ShippersService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class ShippersServiceImpl implements ShippersService {

    private final ShippersRepository repository;

    public ShippersServiceImpl(ShippersRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Shippers> findAll() {
        return repository.findAll();
    }

    @Override
    public Page<Shippers> findPage(String filter, Pageable pageable) {
        if (filter == null || filter.isBlank()) {
            return repository.findAll(pageable);
        }
        return repository.search(filter.trim(), pageable);
    }

    @Override
    public Optional<Shippers> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Shippers save(Shippers entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public Shippers update(Integer id, Shippers entity) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Shippers introuvable avec id: " + id);
        }
        entity.setShipperid(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
