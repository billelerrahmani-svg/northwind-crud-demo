package com.example.northwind.service.impl;

import com.example.northwind.entity.OrderDetails;
import com.example.northwind.entity.OrderDetailsId;
import com.example.northwind.repository.OrderDetailsRepository;
import com.example.northwind.service.OrderDetailsService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class OrderDetailsServiceImpl implements OrderDetailsService {

    private final OrderDetailsRepository repository;

    public OrderDetailsServiceImpl(OrderDetailsRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<OrderDetails> findAll() {
        return repository.findAll();
    }

    /** Pas de colonne texte dans la table : le filtre global est ignoré. */
    @Override
    public Page<OrderDetails> findPage(String filter, Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Optional<OrderDetails> findById(OrderDetailsId id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public OrderDetails save(OrderDetails entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public OrderDetails update(OrderDetailsId id, OrderDetails entity) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("OrderDetails introuvable avec id: " + id);
        }
        entity.setOrderid(id.getOrderid());
        entity.setProductid(id.getProductid());
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void deleteById(OrderDetailsId id) {
        repository.deleteById(id);
    }
}
