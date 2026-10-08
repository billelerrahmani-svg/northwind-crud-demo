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
@Table(name = "Region")
public class Region {

    @Id
    @NotNull
    @Column(name = "RegionID", nullable = false)
    private Integer regionid;

    @NotNull
    @Size(max = 50)
    @Column(name = "RegionDescription", nullable = false)
    private String regiondescription;

}
