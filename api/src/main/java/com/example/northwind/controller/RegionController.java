package com.example.northwind.controller;

import com.example.northwind.entity.Region;
import com.example.northwind.service.RegionService;
import com.example.northwind.web.PageResponse;

import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/region")
public class RegionController {

    private final RegionService service;

    public RegionController(RegionService service) {
        this.service = service;
    }

    @GetMapping
    public List<Region> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public PageResponse<Region> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "regionid") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(name = "q", required = false) String filter) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageResponse.of(service.findPage(filter, PageRequest.of(page, size, Sort.by(direction, sort))));
    }

    @GetMapping("/{regionid}")
    public ResponseEntity<Region> getById(@PathVariable Integer regionid) {
        return service.findById(regionid)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Region> create(@Valid @RequestBody Region region) {
        Region created = service.save(region);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{regionid}")
    public ResponseEntity<Region> update(@PathVariable Integer regionid, @Valid @RequestBody Region region) {
        return ResponseEntity.ok(service.update(regionid, region));
    }

    @DeleteMapping("/{regionid}")
    public ResponseEntity<Void> delete(@PathVariable Integer regionid) {
        service.deleteById(regionid);
        return ResponseEntity.noContent().build();
    }
}
