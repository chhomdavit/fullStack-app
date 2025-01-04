package com.web.backend_byspring.service;

import com.web.backend_byspring.dto.OrderRequest;
import com.web.backend_byspring.dto.PaymentRequest;
import com.web.backend_byspring.dto.PaymentResponse;
import com.web.backend_byspring.enumeration.PaymentStatus;

import java.util.List;

public interface PaymentService {

    String pay(PaymentRequest paymentRequest);

    String inquiry(String orderId);

    String update(PaymentStatus paymentStatus, Long paymentId);

    List<PaymentResponse> getAll();
}
