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
@Table(name = "Suppliers")
public class Suppliers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SupplierID", nullable = false)
    private Integer supplierid;

    @NotNull
    @Size(max = 40)
    @Column(name = "CompanyName", nullable = false)
    private String companyname;

    @Size(max = 30)
    @Column(name = "ContactName")
    private String contactname;

    @Size(max = 30)
    @Column(name = "ContactTitle")
    private String contacttitle;

    @Size(max = 60)
    @Column(name = "Address")
    private String address;

    @Size(max = 15)
    @Column(name = "City")
    private String city;

    @Size(max = 15)
    @Column(name = "Region")
    private String region;

    @Size(max = 10)
    @Column(name = "PostalCode")
    private String postalcode;

    @Size(max = 15)
    @Column(name = "Country")
    private String country;

    @Size(max = 24)
    @Column(name = "Phone")
    private String phone;

    @Size(max = 24)
    @Column(name = "Fax")
    private String fax;

    @Column(name = "HomePage")
    private String homepage;

}
