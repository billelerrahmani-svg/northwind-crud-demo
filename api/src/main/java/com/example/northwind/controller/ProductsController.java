package com.example.northwind.controller;

import com.example.northwind.entity.Products;
import com.example.northwind.service.ProductsService;
import com.example.northwind.web.PageResponse;

import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductsController {

    private final ProductsService service;

    public ProductsController(ProductsService service) {
        this.service = service;
    }

    @GetMapping
    public List<Products> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public PageResponse<Products> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "productid") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(name = "q", required = false) String filter) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageResponse.of(service.findPage(filter, PageRequest.of(page, size, Sort.by(direction, sort))));
    }

    @GetMapping("/{productid}")
    public ResponseEntity<Products> getById(@PathVariable Integer productid) {
        return service.findById(productid)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Products> create(@Valid @RequestBody Products products) {
        Products created = service.save(products);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{productid}")
    public ResponseEntity<Products> update(@PathVariable Integer productid, @Valid @RequestBody Products products) {
        return ResponseEntity.ok(service.update(productid, products));
    }

    @DeleteMapping("/{productid}")
    public ResponseEntity<Void> delete(@PathVariable Integer productid) {
        service.deleteById(productid);
        return ResponseEntity.noContent().build();
    }
}
