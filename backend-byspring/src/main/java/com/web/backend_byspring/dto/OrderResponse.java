package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.web.backend_byspring.enumeration.OrderStatus;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse {

    private Long id;

    private CustomerRespones customer;

    private Double subTotal;

    private Double bill;

    private Double discount;

    private Double tax;

    private PaymentResponse Payment;

    @JsonProperty(value = "order_status")
    private OrderStatus orderStatus;

    @JsonProperty(value = "created_at")
    private LocalDateTime createdAt;

    @JsonProperty(value = "updated_at")
    private LocalDateTime updatedAt;

}
