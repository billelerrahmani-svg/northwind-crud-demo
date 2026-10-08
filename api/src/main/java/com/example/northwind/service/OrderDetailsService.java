package com.example.northwind.service;

import com.example.northwind.entity.OrderDetails;
import com.example.northwind.entity.OrderDetailsId;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface OrderDetailsService {

    List<OrderDetails> findAll();

    Page<OrderDetails> findPage(String filter, Pageable pageable);

    Optional<OrderDetails> findById(OrderDetailsId id);

    OrderDetails save(OrderDetails entity);

    OrderDetails update(OrderDetailsId id, OrderDetails entity);

    void deleteById(OrderDetailsId id);
}
