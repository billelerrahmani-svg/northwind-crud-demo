package com.example.northwind.controller;

import com.example.northwind.entity.Shippers;
import com.example.northwind.service.ShippersService;
import com.example.northwind.web.PageResponse;

import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shippers")
public class ShippersController {

    private final ShippersService service;

    public ShippersController(ShippersService service) {
        this.service = service;
    }

    @GetMapping
    public List<Shippers> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public PageResponse<Shippers> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "shipperid") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(name = "q", required = false) String filter) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageResponse.of(service.findPage(filter, PageRequest.of(page, size, Sort.by(direction, sort))));
    }

    @GetMapping("/{shipperid}")
    public ResponseEntity<Shippers> getById(@PathVariable Integer shipperid) {
        return service.findById(shipperid)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Shippers> create(@Valid @RequestBody Shippers shippers) {
        Shippers created = service.save(shippers);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{shipperid}")
    public ResponseEntity<Shippers> update(@PathVariable Integer shipperid, @Valid @RequestBody Shippers shippers) {
        return ResponseEntity.ok(service.update(shipperid, shippers));
    }

    @DeleteMapping("/{shipperid}")
    public ResponseEntity<Void> delete(@PathVariable Integer shipperid) {
        service.deleteById(shipperid);
        return ResponseEntity.noContent().build();
    }
}
