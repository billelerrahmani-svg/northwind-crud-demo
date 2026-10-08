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
@Table(name = "Categories")
public class Categories {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID", nullable = false)
    private Integer categoryid;

    @NotNull
    @Size(max = 15)
    @Column(name = "CategoryName", nullable = false)
    private String categoryname;

    @Column(name = "Description")
    private String description;

    @Column(name = "Picture")
    private byte[] picture;

}
