package com.example.northwind.service.impl;

import com.example.northwind.entity.Orders;
import com.example.northwind.repository.OrdersRepository;
import com.example.northwind.service.OrdersService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class OrdersServiceImpl implements OrdersService {

    private final OrdersRepository repository;

    public OrdersServiceImpl(OrdersRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Orders> findAll() {
        return repository.findAll();
    }

    @Override
    public Page<Orders> findPage(String filter, Pageable pageable) {
        if (filter == null || filter.isBlank()) {
            return repository.findAll(pageable);
        }
        return repository.search(filter.trim(), pageable);
    }

    @Override
    public Optional<Orders> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Orders save(Orders entity) {
        return repository.save(entity);
    }

    @Override
    @Transactional
    public Orders update(Integer id, Orders entity) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Orders introuvable avec id: " + id);
        }
        entity.setOrderid(id);
        return repository.save(entity);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
