package com.web.backend_byspring.service.Impl;

import com.web.backend_byspring.dto.OrderItemResponse;
import com.web.backend_byspring.model.OrderItem;
import com.web.backend_byspring.repository.OrderItemRepository;
import com.web.backend_byspring.service.OrderItemService;
import com.web.backend_byspring.service.handler.OrderItemHandlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderItemHandlerService orderItemHandlerService;

    @Override
    public List<OrderItemResponse> getOrderItemsByOrderId(Long orderId) {
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
        return orderItems.stream().map(orderItem -> {
            OrderItemResponse response = orderItemHandlerService.convertOrderItemToOrderItemResponse(orderItem);
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    public List<OrderItemResponse> getAll() {
        List<OrderItem> orderItems = orderItemRepository.findAll();
        return orderItems.stream().map(orderItem -> {
            OrderItemResponse response = orderItemHandlerService.convertOrderItemToOrderItemResponse(orderItem);
            return response;
        }).collect(Collectors.toList());
    }
}
