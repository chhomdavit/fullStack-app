package com.web.backend_byspring.service.Impl;

import com.web.backend_byspring.dto.PaymentRequest;
import com.web.backend_byspring.dto.PaymentResponse;
import com.web.backend_byspring.enumeration.PaymentStatus;
import com.web.backend_byspring.exception.InvalidException;
import com.web.backend_byspring.model.Payment;
import com.web.backend_byspring.repository.PaymentRepository;
import com.web.backend_byspring.service.PaymentService;
import com.web.backend_byspring.service.handler.PaymentHandlerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentHandlerService paymentHandlerService;
    private final PaymentRepository paymentRepository;
    @Override
    public String pay(PaymentRequest paymentRequest) {
        return paymentHandlerService.postingToPaymentGateway(paymentRequest);
    }

    @Override
    public String inquiry(String orderId) {
        return "";
    }

    @Override
    public String update(PaymentStatus paymentStatus, Long paymentId) {
        Optional<Payment> paymentOptional = paymentRepository.findById(paymentId);
        if (paymentOptional.isEmpty()) {
            throw new InvalidException("Payment not found for ID: " + paymentId);
        }
        Payment payment = paymentOptional.get();
        payment.setPaymentStatus(paymentStatus);
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);
        return "Payment and Order status updated successfully.";
    }

    @Override
    public List<PaymentResponse> getAll() {
        List<Payment> payments = paymentRepository.findAll();
        return payments.stream().map(payment -> {
            PaymentResponse response = paymentHandlerService.convertPaymentToPaymentResponse(payment);
            return response;
        }).collect(Collectors.toList());
    }

}
