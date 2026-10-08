package com.example.northwind.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Shippers")
public class Shippers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ShipperID", nullable = false)
    private Integer shipperid;

    @NotNull
    @Size(max = 40)
    @Column(name = "CompanyName", nullable = false)
    private String companyname;

    @Size(max = 24)
    @Column(name = "Phone")
    private String phone;

}
