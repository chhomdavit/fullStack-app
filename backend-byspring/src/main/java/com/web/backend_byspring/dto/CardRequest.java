package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CardRequest {

    @JsonProperty(value = "quantity_cart")
    private Integer quantityCart;

    @JsonProperty(value = "product_id")
    private Long productId;

    @JsonProperty(value = "customer_id")
    private Long customerId;

}
