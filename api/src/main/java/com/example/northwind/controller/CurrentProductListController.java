package com.example.northwind.controller;

import com.example.northwind.entity.CurrentProductList;
import com.example.northwind.service.CurrentProductListService;
import com.example.northwind.web.PageResponse;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Vue en base : lecture seule (pas d'ajout/modification/suppression). */
@RestController
@RequestMapping("/api/current-product-list")
public class CurrentProductListController {

    private final CurrentProductListService service;

    public CurrentProductListController(CurrentProductListService service) {
        this.service = service;
    }

    @GetMapping
    public List<CurrentProductList> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public PageResponse<CurrentProductList> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "productid") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(name = "q", required = false) String filter) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageResponse.of(service.findPage(filter, PageRequest.of(page, size, Sort.by(direction, sort))));
    }

    @GetMapping("/{productid}")
    public ResponseEntity<CurrentProductList> getById(@PathVariable Integer productid) {
        return service.findById(productid)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
