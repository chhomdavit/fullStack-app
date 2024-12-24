package com.web.backend_byspring.service;

import com.web.backend_byspring.dto.OrderRequest;
import com.web.backend_byspring.dto.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse create(OrderRequest orderRequest);

    List<OrderResponse> getAll();
}
