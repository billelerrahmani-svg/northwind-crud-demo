package com.example.northwind.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderID", nullable = false)
    private Integer orderid;

    @Size(max = 5)
    @Column(name = "CustomerID")
    private String customerid;

    @Column(name = "EmployeeID")
    private Integer employeeid;

    @Column(name = "OrderDate")
    private LocalDateTime orderdate;

    @Column(name = "RequiredDate")
    private LocalDateTime requireddate;

    @Column(name = "ShippedDate")
    private LocalDateTime shippeddate;

    @Column(name = "ShipVia")
    private Integer shipvia;

    @Digits(integer = 15, fraction = 4)
    @Column(name = "Freight")
    private BigDecimal freight;

    @Size(max = 40)
    @Column(name = "ShipName")
    private String shipname;

    @Size(max = 60)
    @Column(name = "ShipAddress")
    private String shipaddress;

    @Size(max = 15)
    @Column(name = "ShipCity")
    private String shipcity;

    @Size(max = 15)
    @Column(name = "ShipRegion")
    private String shipregion;

    @Size(max = 10)
    @Column(name = "ShipPostalCode")
    private String shippostalcode;

    @Size(max = 15)
    @Column(name = "ShipCountry")
    private String shipcountry;

}
