package com.example.northwind.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Order Details")
@IdClass(OrderDetailsId.class)
public class OrderDetails {

    @Id
    @NotNull
    @Column(name = "OrderID", nullable = false)
    private Integer orderid;

    @Id
    @NotNull
    @Column(name = "ProductID", nullable = false)
    private Integer productid;

    @NotNull
    @Digits(integer = 15, fraction = 4)
    @Column(name = "UnitPrice", nullable = false)
    private BigDecimal unitprice;

    @NotNull
    @Min(-32768)
    @Max(32767)
    @Column(name = "Quantity", nullable = false)
    private Integer quantity;

    @NotNull
    @Column(name = "Discount", nullable = false)
    private Float discount;

}
