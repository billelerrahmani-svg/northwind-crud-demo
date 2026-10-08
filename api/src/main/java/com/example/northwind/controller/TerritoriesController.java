package com.example.northwind.controller;

import com.example.northwind.entity.Territories;
import com.example.northwind.service.TerritoriesService;
import com.example.northwind.web.PageResponse;

import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/territories")
public class TerritoriesController {

    private final TerritoriesService service;

    public TerritoriesController(TerritoriesService service) {
        this.service = service;
    }

    @GetMapping
    public List<Territories> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public PageResponse<Territories> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "territoryid") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(name = "q", required = false) String filter) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageResponse.of(service.findPage(filter, PageRequest.of(page, size, Sort.by(direction, sort))));
    }

    @GetMapping("/{territoryid}")
    public ResponseEntity<Territories> getById(@PathVariable String territoryid) {
        return service.findById(territoryid)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Territories> create(@Valid @RequestBody Territories territories) {
        Territories created = service.save(territories);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{territoryid}")
    public ResponseEntity<Territories> update(@PathVariable String territoryid, @Valid @RequestBody Territories territories) {
        return ResponseEntity.ok(service.update(territoryid, territories));
    }

    @DeleteMapping("/{territoryid}")
    public ResponseEntity<Void> delete(@PathVariable String territoryid) {
        service.deleteById(territoryid);
        return ResponseEntity.noContent().build();
    }
}
