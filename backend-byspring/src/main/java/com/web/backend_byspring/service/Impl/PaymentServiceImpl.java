package com.web.backend_byspring.service.Impl;

import com.web.backend_byspring.dto.PaymentRequest;
import com.web.backend_byspring.service.PaymentService;
import com.web.backend_byspring.service.handler.PaymentHandlerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentHandlerService paymentHandlerService;

    @Override
    public String pay(PaymentRequest paymentRequest) {
        return paymentHandlerService.postingToPaymentGateway(paymentRequest);
    }

    @Override
    public String inquiry(String orderId) {
        return "";
    }
}
