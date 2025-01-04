package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PaymentRequest {

    @JsonProperty("amount")
    private double amount;

    @JsonProperty("payment_method")
    private String paymentMethod;

    @JsonProperty("payment_description")
    private String paymentDescription;
}
