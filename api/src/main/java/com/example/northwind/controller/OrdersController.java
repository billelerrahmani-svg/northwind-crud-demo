package com.example.northwind.controller;

import com.example.northwind.entity.Orders;
import com.example.northwind.service.OrdersService;
import com.example.northwind.web.PageResponse;

import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {

    private final OrdersService service;

    public OrdersController(OrdersService service) {
        this.service = service;
    }

    @GetMapping
    public List<Orders> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public PageResponse<Orders> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "orderid") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(name = "q", required = false) String filter) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageResponse.of(service.findPage(filter, PageRequest.of(page, size, Sort.by(direction, sort))));
    }

    @GetMapping("/{orderid}")
    public ResponseEntity<Orders> getById(@PathVariable Integer orderid) {
        return service.findById(orderid)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Orders> create(@Valid @RequestBody Orders orders) {
        Orders created = service.save(orders);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{orderid}")
    public ResponseEntity<Orders> update(@PathVariable Integer orderid, @Valid @RequestBody Orders orders) {
        return ResponseEntity.ok(service.update(orderid, orders));
    }

    @DeleteMapping("/{orderid}")
    public ResponseEntity<Void> delete(@PathVariable Integer orderid) {
        service.deleteById(orderid);
        return ResponseEntity.noContent().build();
    }
}
