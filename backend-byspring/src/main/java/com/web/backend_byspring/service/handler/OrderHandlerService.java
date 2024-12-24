package com.web.backend_byspring.service.handler;

import com.web.backend_byspring.dto.*;
import com.web.backend_byspring.model.Customer;
import com.web.backend_byspring.model.Order;
import com.web.backend_byspring.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OrderHandlerService {

    private final CustomerRepository customerRepository;

    public OrderResponse convertOrderToOrderResponse(Order order){
        Customer customer = customerRepository.findById(order.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found for ID: " + order.getCustomerId()));

        return OrderResponse.builder()
                .id(order.getId())
                .subTotal(order.getSubTotal())
                .tax(order.getTax())
                .bill(order.getBill())
                .discount(order.getDiscount())
                .createdAt(LocalDateTime.now())
                .customer(CustomerRespones.builder()
                        .id(customer.getId())
                        .name(customer.getName())
                        .build())
                .build();
    }

    public Order convertOrderRequestToOrder(OrderRequest orderRequest, Order order){

        order.setCustomerId(orderRequest.getCustomerId());
        order.setDiscount(orderRequest.getDiscount());
        order.setTax(orderRequest.getTax());
        order.setBill(orderRequest.getBill());
        order.setSubTotal(orderRequest.getSubTotal());
        return order;
    }
}
