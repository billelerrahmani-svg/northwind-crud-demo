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
@Table(name = "Territories")
public class Territories {

    @Id
    @NotNull
    @Size(max = 20)
    @Column(name = "TerritoryID", nullable = false)
    private String territoryid;

    @NotNull
    @Size(max = 50)
    @Column(name = "TerritoryDescription", nullable = false)
    private String territorydescription;

    @NotNull
    @Column(name = "RegionID", nullable = false)
    private Integer regionid;

}
