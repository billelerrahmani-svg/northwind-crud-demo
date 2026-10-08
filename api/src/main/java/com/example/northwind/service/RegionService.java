package com.example.northwind.service;

import com.example.northwind.entity.Region;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface RegionService {

    List<Region> findAll();

    Page<Region> findPage(String filter, Pageable pageable);

    Optional<Region> findById(Integer id);

    Region save(Region entity);

    Region update(Integer id, Region entity);

    void deleteById(Integer id);
}
