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
@Table(name = "EmployeeTerritories")
@IdClass(EmployeeterritoriesId.class)
public class Employeeterritories {

    @Id
    @NotNull
    @Column(name = "EmployeeID", nullable = false)
    private Integer employeeid;

    @Id
    @NotNull
    @Size(max = 20)
    @Column(name = "TerritoryID", nullable = false)
    private String territoryid;

}
