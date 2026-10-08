package com.example.northwind.controller;

import com.example.northwind.entity.Employees;
import com.example.northwind.service.EmployeesService;
import com.example.northwind.web.PageResponse;

import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeesController {

    private final EmployeesService service;

    public EmployeesController(EmployeesService service) {
        this.service = service;
    }

    @GetMapping
    public List<Employees> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public PageResponse<Employees> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "employeeid") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(name = "q", required = false) String filter) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageResponse.of(service.findPage(filter, PageRequest.of(page, size, Sort.by(direction, sort))));
    }

    @GetMapping("/{employeeid}")
    public ResponseEntity<Employees> getById(@PathVariable Integer employeeid) {
        return service.findById(employeeid)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Employees> create(@Valid @RequestBody Employees employees) {
        Employees created = service.save(employees);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{employeeid}")
    public ResponseEntity<Employees> update(@PathVariable Integer employeeid, @Valid @RequestBody Employees employees) {
        return ResponseEntity.ok(service.update(employeeid, employees));
    }

    @DeleteMapping("/{employeeid}")
    public ResponseEntity<Void> delete(@PathVariable Integer employeeid) {
        service.deleteById(employeeid);
        return ResponseEntity.noContent().build();
    }
}
