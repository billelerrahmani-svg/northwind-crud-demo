package com.example.northwind.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Employees")
public class Employees {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EmployeeID", nullable = false)
    private Integer employeeid;

    @NotNull
    @Size(max = 20)
    @Column(name = "LastName", nullable = false)
    private String lastname;

    @NotNull
    @Size(max = 10)
    @Column(name = "FirstName", nullable = false)
    private String firstname;

    @Size(max = 30)
    @Column(name = "Title")
    private String title;

    @Size(max = 25)
    @Column(name = "TitleOfCourtesy")
    private String titleofcourtesy;

    @Column(name = "BirthDate")
    private LocalDateTime birthdate;

    @Column(name = "HireDate")
    private LocalDateTime hiredate;

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
    @Column(name = "HomePhone")
    private String homephone;

    @Size(max = 4)
    @Column(name = "Extension")
    private String extension;

    @Column(name = "Photo")
    private byte[] photo;

    @Column(name = "Notes")
    private String notes;

    @Column(name = "ReportsTo")
    private Integer reportsto;

    @Size(max = 255)
    @Column(name = "PhotoPath")
    private String photopath;

}
