package com.example.northwind.controller;

import com.example.northwind.entity.OrderDetails;
import com.example.northwind.entity.OrderDetailsId;
import com.example.northwind.service.OrderDetailsService;
import com.example.northwind.web.PageResponse;

import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
public class OrderDetailsController {

    private final OrderDetailsService service;

    public OrderDetailsController(OrderDetailsService service) {
        this.service = service;
    }

    @GetMapping
    public List<OrderDetails> getAll() {
        return service.findAll();
    }

    @GetMapping("/page")
    public PageResponse<OrderDetails> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "orderid") String sort,
            @RequestParam(defaultValue = "asc") String dir,
            @RequestParam(name = "q", required = false) String filter) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return PageResponse.of(service.findPage(filter, PageRequest.of(page, size, Sort.by(direction, sort))));
    }

    @GetMapping("/{orderid}/{productid}")
    public ResponseEntity<OrderDetails> getById(@PathVariable Integer orderid, @PathVariable Integer productid) {
        return service.findById(new OrderDetailsId(orderid, productid))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OrderDetails> create(@Valid @RequestBody OrderDetails orderDetails) {
        OrderDetails created = service.save(orderDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{orderid}/{productid}")
    public ResponseEntity<OrderDetails> update(@PathVariable Integer orderid, @PathVariable Integer productid, @Valid @RequestBody OrderDetails orderDetails) {
        return ResponseEntity.ok(service.update(new OrderDetailsId(orderid, productid), orderDetails));
    }

    @DeleteMapping("/{orderid}/{productid}")
    public ResponseEntity<Void> delete(@PathVariable Integer orderid, @PathVariable Integer productid) {
        service.deleteById(new OrderDetailsId(orderid, productid));
        return ResponseEntity.noContent().build();
    }
}
