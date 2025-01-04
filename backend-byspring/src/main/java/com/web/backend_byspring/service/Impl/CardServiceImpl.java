package com.web.backend_byspring.service.Impl;

import com.web.backend_byspring.dto.CardRequest;
import com.web.backend_byspring.dto.CardResponse;
import com.web.backend_byspring.model.Card;
import com.web.backend_byspring.model.Customer;
import com.web.backend_byspring.model.Employee;
import com.web.backend_byspring.model.Product;
import com.web.backend_byspring.repository.CardRepository;
import com.web.backend_byspring.repository.CustomerRepository;
import com.web.backend_byspring.repository.EmployeeRepository;
import com.web.backend_byspring.repository.ProductRepository;
import com.web.backend_byspring.service.handler.CardHandlerService;
import com.web.backend_byspring.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final ProductRepository productRepository;
    private final CardHandlerService cardHandlerService;

    @Override
    public CardResponse create(CardRequest cardRequest) {
        Customer customer = this.customerRepository.findById(cardRequest.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Product product = this.productRepository.findById(cardRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<Card> existingCart = cardRepository
                .findByCustomerIdAndProductId(customer.getId(), product.getId());

        Card card;
        if (existingCart.isPresent()) {
            card = existingCart.get();
            card.setQuantityCart(card.getQuantityCart() + cardRequest.getQuantityCart());
        } else {
            card = new Card();
            card.setCustomerId(customer.getId());
            card.setProductId(product.getId());
            card.setQuantityCart(cardRequest.getQuantityCart());
            card.setCreatedAt(LocalDateTime.now());
        }
        card.setTotalPrice(card.getQuantityCart() * product.getPrice());
        cardRepository.saveAndFlush(card);
        return cardHandlerService.convertCardToCardResponse(card);
    }

    @Override
    public CardResponse update(CardRequest cardRequest, Long id) {
        Card card = this.cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Customer customer = this.customerRepository.findById(cardRequest.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Product product = this.productRepository.findById(cardRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!card.getCustomerId().equals(cardRequest.getCustomerId())) {
            throw new RuntimeException("Unauthorized: Customer ID does not match the cart's owner");
        }

        if (!card.getProductId().equals(cardRequest.getProductId())) {
            throw new RuntimeException("Unauthorized: Product ID does not match the cart's owner");
        }
        card.setQuantityCart(cardRequest.getQuantityCart());
        card.setCustomerId(customer.getId());
        card.setProductId(product.getId());
        card.setTotalPrice(card.getQuantityCart() * product.getPrice());
        card.setUpdatedAt(LocalDateTime.now());
        Card cardSaved = cardRepository.save(card);
        return cardHandlerService.convertCardToCardResponse(cardSaved);
    }

    @Override
    public void delete(Long customerId, Long id) {
        Card card = this.cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Customer customer = this.customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (!customer.getId().equals(customer.getId())) {
            throw new RuntimeException("Customer not authorized to delete this cart");
        }
        cardRepository.delete(card);
    }

    @Override
    public List<CardResponse> findByCustomerId(Long customerId) {
        Customer customer = this.customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return this.cardRepository.findByCustomerId(customer.getId()).stream()
                .map(cardHandlerService::convertCardToCardResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CardResponse> findAll() {
        List<Card> carts = cardRepository.findAll();
        return carts.stream().map(card -> {
            CardResponse response = cardHandlerService.convertCardToCardResponse(card);
            return response;
        }).collect(Collectors.toList());
    }
}
