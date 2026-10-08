package com.example.northwind.service.impl;

import com.example.northwind.entity.Territories;
import com.example.northwind.repository.TerritoriesRepository;
import com.example.northwind.service.TerritoriesService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class TerritoriesServiceImpl implements TerritoriesService {

    private final TerritoriesRepository repository;

    public TerritoriesServiceImpl(TerritoriesRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Territories> findAll() {
        return repository.findAll();
    }

    @Override
    public Page<Territories> findPage(String filter, Pageable pageable) {
        if (filter == null || filter.isBlank()) {
            return repository.findAll(pageable);
        }
        return repository.search(filter.trim(), pageable);
    }

    @Override
    public Optional<Territories> findById(String id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Territories save(Territories entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public Territories update(String id, Territories entity) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Territories introuvable avec id: " + id);
        }
        entity.setTerritoryid(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void deleteById(String id) {
        repository.deleteById(id);
    }
}
