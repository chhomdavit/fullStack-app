package com.web.backend_byspring.service;

import com.web.backend_byspring.dto.PaymentRequest;

public interface PaymentService {

    String pay(PaymentRequest paymentRequest);

    String inquiry(String orderId);
}
