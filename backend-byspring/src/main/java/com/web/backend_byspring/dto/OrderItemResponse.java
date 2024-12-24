package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponse {

    private Long id;

    private CustomerRespones customer;

    private ProductResponse product;

    @JsonProperty(value = "quantity_order")
    private Integer quantityOrder;

    @JsonProperty(value = "total_price")
    private Double totalPrice;
}
