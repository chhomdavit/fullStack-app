package com.web.backend_byspring.service.Impl;

import com.web.backend_byspring.dto.OrderRequest;
import com.web.backend_byspring.dto.OrderResponse;
import com.web.backend_byspring.dto.PaginationResponse;
import com.web.backend_byspring.enumeration.PaymentStatus;
import com.web.backend_byspring.exception.InvalidException;
import com.web.backend_byspring.model.*;
import com.web.backend_byspring.repository.CardRepository;
import com.web.backend_byspring.repository.OrderRepository;
import com.web.backend_byspring.repository.PaymentRepository;
import com.web.backend_byspring.repository.ProductRepository;
import com.web.backend_byspring.service.OrderService;
import com.web.backend_byspring.service.handler.OrderHandlerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CardRepository cardRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
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

        Payment payment = new Payment();
        payment = orderHandlerService.convertPaymentRequestToPayment(orderRequest,payment);
        Payment savedPayment = paymentRepository.saveAndFlush(payment);
        if (savedPayment.getId() == null) {
            throw new RuntimeException("Payment creation failed. Please try again later.");
        }
        order.setPaymentId(savedPayment.getId());

        Order orders = order;
        List<OrderItem> orderItems = cardList.stream().map(card -> {
            Product product = productRepository.findById(card.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found ID"));
            product.setProductQuantity(product.getProductQuantity() - card.getQuantityCart());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(orders);
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
        cardRepository.deleteAll(cardList);
        return orderHandlerService.convertOrderToOrderResponse(savedOrder);
    }

    @Override
    public OrderResponse update(OrderRequest orderRequest, Long id) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isEmpty()) {
            throw new InvalidException("Order not found.");
        }
        Order order = orderOptional.get();
        order.setOrderStatus(orderRequest.getOrderStatus());
        order.setUpdatedAt(LocalDateTime.now());
        Optional<Payment> paymentOptional = paymentRepository.findById(order.getPaymentId());
        if (paymentOptional.isPresent()) {
            Payment payment = paymentOptional.get();
            switch (orderRequest.getOrderStatus()) {
                case SUCCESS:
                    payment.setPaymentStatus(PaymentStatus.SUCCESS);
                case DELIVERED:
                    break;
                case FAILED:
                    payment.setPaymentStatus(PaymentStatus.FAILED);
                    break;
                case PENDING:
                    payment.setPaymentStatus(PaymentStatus.PENDING);
                    break;
                case PREPARING:
                    break;
                case OUT_FOR_DELIVERY:
                    break;
                default:
            }
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);
        }
        Order updatedOrder = orderRepository.saveAndFlush(order);
        return orderHandlerService.convertOrderToOrderResponse(updatedOrder);
    }


    @Override
    public PaginationResponse<OrderResponse> getAllWithPagination(String keyword, int pageNumber, int pageSize) {

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Order> orderPages;
        if (keyword == null || keyword.trim().isEmpty()) {
            orderPages = orderRepository.findAll(pageable);
        } else {
            Long idKeyword = Long.valueOf(keyword);
            orderPages = orderRepository.findById(idKeyword, pageable);
        }

        List<OrderResponse> orderResponseList = orderPages.getContent().stream()
                .map(orderHandlerService::convertOrderToOrderResponse)
                .toList();
        PaginationResponse<OrderResponse> paginationResponse = new PaginationResponse<>();
        paginationResponse.setList(orderResponseList);
        paginationResponse.setPageNumber(orderPages.getNumber());
        paginationResponse.setPageSize(orderPages.getSize());
        paginationResponse.setTotalElements(orderPages.getTotalElements());
        paginationResponse.setTotalPages(orderPages.getTotalPages());
        paginationResponse.setLast(orderPages.isLast());
        return paginationResponse;
    }

    @Transactional
    @Override
    public void hardDelete(Long id) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();

            List<OrderItem> orderItems = order.getOrderItems();
            for (OrderItem orderItem : orderItems) {
                Product product = productRepository.findById(orderItem.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found with ID: " + orderItem.getProductId()));
                product.setProductQuantity(product.getProductQuantity() + orderItem.getQuantityOrder());
                productRepository.save(product);
            }

            order.setOrderItems(Collections.emptyList());
            orderRepository.save(order);
            orderRepository.flush();
            orderRepository.deleteOrderItemsByOrderId(id);
            Long paymentId = order.getPaymentId();
            if (paymentId != null) {
                paymentRepository.deleteById(paymentId);
            }
            orderRepository.delete(order);
        } else {
            throw new RuntimeException("Order not found with ID: " + id);
        }
    }
}
