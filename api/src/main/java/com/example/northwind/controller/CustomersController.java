package com.example.northwind.controller;

import com.example.northwind.entity.Customers;
import com.example.northwind.service.CustomersService;
import com.example.northwind.web.PageResponse;

import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomersController {

    private final CustomersService service;

    public CustomersController(CustomersService service) {
        this.service = service;
    }

    @GetMapping
    public List<Customers> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public PageResponse<Customers> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "customerid") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(name = "q", required = false) String filter) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageResponse.of(service.findPage(filter, PageRequest.of(page, size, Sort.by(direction, sort))));
    }

    @GetMapping("/{customerid}")
    public ResponseEntity<Customers> getById(@PathVariable String customerid) {
        return service.findById(customerid)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Customers> create(@Valid @RequestBody Customers customers) {
        Customers created = service.save(customers);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{customerid}")
    public ResponseEntity<Customers> update(@PathVariable String customerid, @Valid @RequestBody Customers customers) {
        return ResponseEntity.ok(service.update(customerid, customers));
    }

    @DeleteMapping("/{customerid}")
    public ResponseEntity<Void> delete(@PathVariable String customerid) {
        service.deleteById(customerid);
        return ResponseEntity.noContent().build();
    }
}
