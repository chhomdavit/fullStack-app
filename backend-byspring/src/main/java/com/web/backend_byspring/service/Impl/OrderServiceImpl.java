package com.web.backend_byspring.service.Impl;

import com.web.backend_byspring.dto.OrderRequest;
import com.web.backend_byspring.dto.OrderResponse;
import com.web.backend_byspring.model.*;
import com.web.backend_byspring.repository.CardRepository;
import com.web.backend_byspring.repository.OrderRepository;
import com.web.backend_byspring.repository.ProductRepository;
import com.web.backend_byspring.service.OrderService;
import com.web.backend_byspring.service.handler.OrderHandlerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CardRepository cardRepository;
    private final ProductRepository productRepository;
    private final OrderHandlerService orderHandlerService;

    @Transactional
    @Override
    public OrderResponse create(OrderRequest orderRequest) {

        List<Card> cardList = cardRepository.findByCustomerId(orderRequest.getCustomerId());
        if (cardList.isEmpty()) {
            throw new RuntimeException("Cart is empty for the customer");
        }
        Order order = new Order();
        order = orderHandlerService.convertOrderRequestToOrder(orderRequest, order);

        Order finalOrder = order;
        List<OrderItem> orderItems = cardList.stream().map(card -> {
            Product product = productRepository.findById(card.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            if (product.getProductQuantity() < card.getQuantityCart()) {
                throw new RuntimeException("Insufficient stock for product ID: " + product.getId());
            }
            product.setProductQuantity(product.getProductQuantity() - card.getQuantityCart());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(finalOrder);
            orderItem.setProductId(card.getProductId());
            orderItem.setCustomerId(card.getCustomerId());
            orderItem.setCreatedAt(LocalDateTime.now());
            orderItem.setQuantityOrder(card.getQuantityCart());
            orderItem.setTotalPrice(card.getTotalPrice());
            return orderItem;
        }).collect(Collectors.toList());
        order.setOrderItems(orderItems);
        order.setCreatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);
        return orderHandlerService.convertOrderToOrderResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getAll() {
        return List.of();
    }
}
