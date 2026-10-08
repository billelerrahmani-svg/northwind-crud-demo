package com.example.northwind.entity;

import java.io.Serializable;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Identifiant composite de l'entité OrderDetails.
 * Les noms et types des champs doivent rester identiques à ceux de l'entité.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailsId implements Serializable {

    private Integer orderid;
    private Integer productid;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrderDetailsId that)) return false;
        return Objects.equals(orderid, that.orderid)
                && Objects.equals(productid, that.productid);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderid, productid);
    }
}
