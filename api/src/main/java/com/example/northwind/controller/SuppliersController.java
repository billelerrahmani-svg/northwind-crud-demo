package com.example.northwind.controller;

import com.example.northwind.entity.Suppliers;
import com.example.northwind.service.SuppliersService;
import com.example.northwind.web.PageResponse;

import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SuppliersController {

    private final SuppliersService service;

    public SuppliersController(SuppliersService service) {
        this.service = service;
    }

    @GetMapping
    public List<Suppliers> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public PageResponse<Suppliers> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "supplierid") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(name = "q", required = false) String filter) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageResponse.of(service.findPage(filter, PageRequest.of(page, size, Sort.by(direction, sort))));
    }

    @GetMapping("/{supplierid}")
    public ResponseEntity<Suppliers> getById(@PathVariable Integer supplierid) {
        return service.findById(supplierid)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Suppliers> create(@Valid @RequestBody Suppliers suppliers) {
        Suppliers created = service.save(suppliers);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{supplierid}")
    public ResponseEntity<Suppliers> update(@PathVariable Integer supplierid, @Valid @RequestBody Suppliers suppliers) {
        return ResponseEntity.ok(service.update(supplierid, suppliers));
    }

    @DeleteMapping("/{supplierid}")
    public ResponseEntity<Void> delete(@PathVariable Integer supplierid) {
        service.deleteById(supplierid);
        return ResponseEntity.noContent().build();
    }
}
