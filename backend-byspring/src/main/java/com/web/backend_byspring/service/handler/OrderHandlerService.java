package com.web.backend_byspring.service.handler;

import com.web.backend_byspring.constant.Constant;
import com.web.backend_byspring.dto.*;
import com.web.backend_byspring.enumeration.OrderStatus;
import com.web.backend_byspring.enumeration.PaymentMethod;
import com.web.backend_byspring.enumeration.PaymentStatus;
import com.web.backend_byspring.model.Customer;
import com.web.backend_byspring.model.Order;
import com.web.backend_byspring.model.Payment;
import com.web.backend_byspring.repository.CustomerRepository;
import com.web.backend_byspring.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OrderHandlerService {

    private final CustomerRepository customerRepository;
    private final PaymentRepository paymentRepository;

    public OrderResponse convertOrderToOrderResponse(Order order){
        Customer customer = customerRepository.findById(order.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found for ID: " + order.getCustomerId()));

        Payment payment = paymentRepository.findById(order.getPaymentId())
                .orElseThrow(() -> new IllegalArgumentException("Payment not found for ID: " + order.getPaymentId()));

        return OrderResponse.builder()
                .id(order.getId())
                .subTotal(order.getSubTotal())
                .tax(order.getTax())
                .bill(order.getBill())
                .discount(order.getDiscount())
                .orderStatus(order.getOrderStatus())
                .Payment(PaymentResponse.builder()
                        .id(payment.getId())
                        .paymentStatus(String.valueOf(payment.getPaymentStatus()))
                        .paymentMethod(String.valueOf(payment.getPaymentMethod()))
                        .amount(payment.getAmount())
                        .paymentDescription(payment.getDescription())
                        .build())
                .createdAt(LocalDateTime.now())
                .customer(CustomerRespones.builder()
                        .id(customer.getId())
                        .name(customer.getName())
                        .build())
                .build();
    }

    public Order convertOrderRequestToOrder(OrderRequest orderRequest, Order order){

        order.setCustomerId(orderRequest.getCustomerId());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setDiscount(orderRequest.getDiscount());
        order.setTax(orderRequest.getTax());
        order.setBill(orderRequest.getBill());
        order.setSubTotal(orderRequest.getSubTotal());
        return order;
    }

    public Payment convertPaymentRequestToPayment(OrderRequest orderRequest,Payment payment){
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setAmount(orderRequest.getBill());
        payment.setCreatedBy(String.valueOf(orderRequest.getCustomerId()));
        String paymentMethod = (orderRequest.getPaymentRequest() == null || orderRequest.getPaymentRequest().getPaymentMethod() == null)
                ? Constant.CASH : orderRequest.getPaymentRequest().getPaymentMethod();
        String paymentDescription = (orderRequest.getPaymentRequest() == null || orderRequest.getPaymentRequest().getPaymentDescription() == null)
                ? "cash in hand" : orderRequest.getPaymentRequest().getPaymentDescription();
        payment.setDescription(paymentDescription);
        payment.setPaymentMethod(PaymentMethod.valueOf(paymentMethod));
        payment.setCreatedAt(LocalDateTime.now());
        return payment;
    }

}
