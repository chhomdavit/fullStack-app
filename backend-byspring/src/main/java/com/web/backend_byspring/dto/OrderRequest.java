package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.web.backend_byspring.enumeration.OrderStatus;
import com.web.backend_byspring.model.OrderItem;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class OrderRequest {

    @JsonProperty(value = "customer_id")
    private Long customerId;

    private Double subTotal;

    private Double bill;

    private Double discount;

    private Double tax;

    @JsonProperty("payment")
    private PaymentRequest paymentRequest;

    @JsonProperty("order_status")
    private OrderStatus orderStatus;

    @JsonProperty(value = "order_items")
    private List<OrderItem> orderItems = new ArrayList<>();
}
