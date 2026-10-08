package com.example.northwind.controller;

import com.example.northwind.entity.Categories;
import com.example.northwind.service.CategoriesService;
import com.example.northwind.web.PageResponse;

import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoriesController {

    private final CategoriesService service;

    public CategoriesController(CategoriesService service) {
        this.service = service;
    }

    @GetMapping
    public List<Categories> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public PageResponse<Categories> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "categoryid") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(name = "q", required = false) String filter) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageResponse.of(service.findPage(filter, PageRequest.of(page, size, Sort.by(direction, sort))));
    }

    @GetMapping("/{categoryid}")
    public ResponseEntity<Categories> getById(@PathVariable Integer categoryid) {
        return service.findById(categoryid)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Categories> create(@Valid @RequestBody Categories categories) {
        Categories created = service.save(categories);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{categoryid}")
    public ResponseEntity<Categories> update(@PathVariable Integer categoryid, @Valid @RequestBody Categories categories) {
        return ResponseEntity.ok(service.update(categoryid, categories));
    }

    @DeleteMapping("/{categoryid}")
    public ResponseEntity<Void> delete(@PathVariable Integer categoryid) {
        service.deleteById(categoryid);
        return ResponseEntity.noContent().build();
    }
}
