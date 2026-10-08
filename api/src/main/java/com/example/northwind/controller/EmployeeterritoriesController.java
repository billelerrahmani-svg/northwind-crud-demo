package com.example.northwind.controller;

import com.example.northwind.entity.Employeeterritories;
import com.example.northwind.entity.EmployeeterritoriesId;
import com.example.northwind.service.EmployeeterritoriesService;
import com.example.northwind.web.PageResponse;

import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employeeterritories")
public class EmployeeterritoriesController {

    private final EmployeeterritoriesService service;

    public EmployeeterritoriesController(EmployeeterritoriesService service) {
        this.service = service;
    }

    @GetMapping
    public List<Employeeterritories> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public PageResponse<Employeeterritories> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "employeeid") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(name = "q", required = false) String filter) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageResponse.of(service.findPage(filter, PageRequest.of(page, size, Sort.by(direction, sort))));
    }

    @GetMapping("/{employeeid}/{territoryid}")
    public ResponseEntity<Employeeterritories> getById(@PathVariable Integer employeeid, @PathVariable String territoryid) {
        return service.findById(new EmployeeterritoriesId(employeeid, territoryid))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Employeeterritories> create(@Valid @RequestBody Employeeterritories employeeterritories) {
        Employeeterritories created = service.save(employeeterritories);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{employeeid}/{territoryid}")
    public ResponseEntity<Employeeterritories> update(@PathVariable Integer employeeid, @PathVariable String territoryid, @Valid @RequestBody Employeeterritories employeeterritories) {
        return ResponseEntity.ok(service.update(new EmployeeterritoriesId(employeeid, territoryid), employeeterritories));
    }

    @DeleteMapping("/{employeeid}/{territoryid}")
    public ResponseEntity<Void> delete(@PathVariable Integer employeeid, @PathVariable String territoryid) {
        service.deleteById(new EmployeeterritoriesId(employeeid, territoryid));
        return ResponseEntity.noContent().build();
    }
}
