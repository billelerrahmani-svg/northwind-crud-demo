package com.example.northwind.service.impl;

import com.example.northwind.entity.Region;
import com.example.northwind.repository.RegionRepository;
import com.example.northwind.service.RegionService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class RegionServiceImpl implements RegionService {

    private final RegionRepository repository;

    public RegionServiceImpl(RegionRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Region> findAll() {
        return repository.findAll();
    }

    @Override
    public Page<Region> findPage(String filter, Pageable pageable) {
        if (filter == null || filter.isBlank()) {
            return repository.findAll(pageable);
        }
        return repository.search(filter.trim(), pageable);
    }

    @Override
    public Optional<Region> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Region save(Region entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public Region update(Integer id, Region entity) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Region introuvable avec id: " + id);
        }
        entity.setRegionid(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
