package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CardResponse {

    private Long id;

    @JsonProperty(value = "quantity_cart")
    private Integer quantityCart;

    @JsonProperty(value = "total_price")
    private Double totalPrice;

    @JsonProperty(value = "product_id")
    private ProductResponse productId;

    @JsonProperty(value = "customer_id")
    private CustomerRespones customerId;

    @JsonProperty(value = "created_at")
    private LocalDateTime createdAt ;

    @JsonProperty(value = "updated_at")
    private LocalDateTime updatedAt;
}
