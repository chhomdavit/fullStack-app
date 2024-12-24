package com.web.backend_byspring.service.handler;

import com.web.backend_byspring.dto.CardResponse;
import com.web.backend_byspring.dto.CustomerRespones;
import com.web.backend_byspring.dto.ProductResponse;
import com.web.backend_byspring.model.Card;
import com.web.backend_byspring.model.Customer;
import com.web.backend_byspring.model.Product;
import com.web.backend_byspring.repository.CustomerRepository;
import com.web.backend_byspring.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CardHandlerService {

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;


    public CardResponse convertCardToCardResponse(Card card){
        Customer customer = customerRepository.findById(card.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found for ID: " + card.getCreatedBy()));

        Product product = productRepository.findById(card.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found for ID: " + card.getProductId()));

        return CardResponse.builder()
                .id(card.getId())
                .quantityCart(card.getQuantityCart())
                .totalPrice(card.getTotalPrice())
                .productId(ProductResponse.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .build())
                .customerId(CustomerRespones.builder()
                        .id(customer.getId())
                        .name(customer.getName())
                        .build())
                .createdAt(card.getCreatedAt())
                .updatedAt(card.getUpdatedAt())
                .build();
    }

}
