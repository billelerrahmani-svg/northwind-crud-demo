package com.example.northwind.service;

import com.example.northwind.entity.Territories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface TerritoriesService {

    List<Territories> findAll();

    Page<Territories> findPage(String filter, Pageable pageable);

    Optional<Territories> findById(String id);

    Territories save(Territories entity);

    Territories update(String id, Territories entity);

    void deleteById(String id);
}
