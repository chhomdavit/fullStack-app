package com.web.backend_byspring.service.handler;

import com.web.backend_byspring.constant.Constant;
import com.web.backend_byspring.dto.CustomerRespones;
import com.web.backend_byspring.dto.PaymentRequest;
import com.web.backend_byspring.dto.PaymentResponse;
import com.web.backend_byspring.enumeration.PaymentMethod;
import com.web.backend_byspring.enumeration.PaymentStatus;
import com.web.backend_byspring.model.Customer;
import com.web.backend_byspring.model.Payment;
import com.web.backend_byspring.repository.CustomerRepository;
import com.web.backend_byspring.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentHandlerService {

    private final PaymentRepository paymentRepository;
    private final CustomerRepository customerRepository;
    private final KhQRHandlerService khQRHandlerService;
    private final CashHandlerService cashHandlerService;


    public String postingToPaymentGateway(PaymentRequest paymentRequest) {
        log.info("Posting to payment gateway");

        if(Constant.BANK.equalsIgnoreCase(paymentRequest.getPaymentMethod())) {
            log.info("Payment method is bank");
            String khQRServerResponse = khQRHandlerService.postingToKhQRApi(paymentRequest);
            savePaymentTransaction(paymentRequest, khQRServerResponse);

            // verify the response make sure it success or fail
            if(StringUtils.hasText(khQRServerResponse)){
                return Constant.SUCCESS;
            }
            return Constant.FAILED;
        }

        if(Constant.CASH.equalsIgnoreCase(paymentRequest.getPaymentMethod())) {
            log.info("Payment method is cash");
            String cashServerResponse = cashHandlerService.postingToCashApi(paymentRequest);
            savePaymentTransaction(paymentRequest, cashServerResponse);
            if(StringUtils.hasText(cashServerResponse)){
                return Constant.SUCCESS;
            }
            return Constant.FAILED;
        }

        if(Constant.CARD.equalsIgnoreCase(paymentRequest.getPaymentMethod())) {
            return Constant.SUCCESS;
        }
        log.info("Payment method is not supported");
        return Constant.FAILED;
    }

    public void savePaymentTransaction(PaymentRequest paymentRequest, String response) {

        Payment payment = new Payment();
        payment.setPaymentMethod(PaymentMethod.valueOf(paymentRequest.getPaymentMethod()));
        if(StringUtils.hasText(response)) {
            payment.setPaymentStatus(PaymentStatus.SUCCESS);
        } else {
            payment.setPaymentStatus(PaymentStatus.FAILED);
        }
        payment.setAmount(paymentRequest.getAmount());
        payment.setCreatedAt(LocalDateTime.now());
        payment.setCreatedBy(Constant.SYSTEM);

        log.info("Saving payment transaction: {}", payment);
        paymentRepository.save(payment);
    }

    public PaymentResponse convertPaymentToPaymentResponse(Payment payment) {

        return PaymentResponse.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod().name())
                .paymentStatus(payment.getPaymentStatus().name())
                .paymentDescription(payment.getDescription())
                .createdBy(payment.getCreatedBy())
                .build();
    }
}
