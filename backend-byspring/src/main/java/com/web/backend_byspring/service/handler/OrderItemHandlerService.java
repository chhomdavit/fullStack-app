package com.web.backend_byspring.service.handler;

import com.web.backend_byspring.dto.CustomerRespones;
import com.web.backend_byspring.dto.OrderItemResponse;
import com.web.backend_byspring.dto.ProductResponse;
import com.web.backend_byspring.model.Customer;
import com.web.backend_byspring.model.OrderItem;
import com.web.backend_byspring.model.Product;
import com.web.backend_byspring.repository.CustomerRepository;
import com.web.backend_byspring.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderItemHandlerService {

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public OrderItemResponse convertOrderItemToOrderItemResponse(OrderItem orderItem){

        Customer customer = customerRepository.findById(orderItem.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found for ID: " + orderItem.getCustomerId()));

        Product product = productRepository.findById(orderItem.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found for ID: " + orderItem.getProductId()));

        return OrderItemResponse.builder()
                .id(orderItem.getId())
                .customer(CustomerRespones.builder()
                        .id(customer.getId())
                        .name(customer.getName())
                        .build())
                .product(ProductResponse.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .price(product.getPrice())
                        .build())
                .quantityOrder(orderItem.getQuantityOrder())
                .totalPrice(orderItem.getTotalPrice())
                .createdAt(orderItem.getCreatedAt())
                .build();
    }
}
