package com.example.northwind.service;

import com.example.northwind.entity.Orders;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface OrdersService {

    List<Orders> findAll();

    Page<Orders> findPage(String filter, Pageable pageable);

    Optional<Orders> findById(Integer id);

    Orders save(Orders entity);

    Orders update(Integer id, Orders entity);

    void deleteById(Integer id);
}
