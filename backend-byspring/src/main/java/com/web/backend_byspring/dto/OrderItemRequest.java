package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.web.backend_byspring.model.Order;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrderItemRequest {

    private Order order;

    @JsonProperty(value = "customer_id")
    private Long customerId;

    @JsonProperty(value = "product_id")
    private Long productId;

    @JsonProperty(value = "quantity_order")
    private Integer quantityOrder;

    @JsonProperty(value = "total_price")
    private Double totalPrice;
}
