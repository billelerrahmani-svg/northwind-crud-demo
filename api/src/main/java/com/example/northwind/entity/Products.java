package com.example.northwind.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Products")
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProductID", nullable = false)
    private Integer productid;

    @NotNull
    @Size(max = 40)
    @Column(name = "ProductName", nullable = false)
    private String productname;

    @Column(name = "SupplierID")
    private Integer supplierid;

    @Column(name = "CategoryID")
    private Integer categoryid;

    @Size(max = 20)
    @Column(name = "QuantityPerUnit")
    private String quantityperunit;

    @Digits(integer = 15, fraction = 4)
    @Column(name = "UnitPrice")
    private BigDecimal unitprice;

    @Min(-32768)
    @Max(32767)
    @Column(name = "UnitsInStock")
    private Integer unitsinstock;

    @Min(-32768)
    @Max(32767)
    @Column(name = "UnitsOnOrder")
    private Integer unitsonorder;

    @Min(-32768)
    @Max(32767)
    @Column(name = "ReorderLevel")
    private Integer reorderlevel;

    @NotNull
    @Column(name = "Discontinued", nullable = false)
    private Boolean discontinued;

}
