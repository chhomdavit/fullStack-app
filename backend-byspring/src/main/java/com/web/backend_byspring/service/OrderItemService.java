package com.web.backend_byspring.service;

import com.web.backend_byspring.dto.OrderItemRequest;
import com.web.backend_byspring.dto.OrderItemResponse;

import java.util.List;

public interface OrderItemService {

    List<OrderItemResponse> getOrderItemsByOrderId(Long orderId);

    List<OrderItemResponse> getAll();
}
