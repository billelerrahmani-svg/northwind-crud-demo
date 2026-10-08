package com.example.northwind.entity;

import java.io.Serializable;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Identifiant composite de l'entité Employeeterritories.
 * Les noms et types des champs doivent rester identiques à ceux de l'entité.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeterritoriesId implements Serializable {

    private Integer employeeid;
    private String territoryid;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EmployeeterritoriesId that)) return false;
        return Objects.equals(employeeid, that.employeeid)
                && Objects.equals(territoryid, that.territoryid);
    }

    @Override
    public int hashCode() {
        return Objects.hash(employeeid, territoryid);
    }
}
