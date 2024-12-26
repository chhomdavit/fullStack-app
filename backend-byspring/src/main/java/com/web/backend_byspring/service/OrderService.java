package com.web.backend_byspring.service;

import com.web.backend_byspring.dto.OrderRequest;
import com.web.backend_byspring.dto.OrderResponse;
import com.web.backend_byspring.dto.PaginationResponse;

import java.util.List;

public interface OrderService {

    OrderResponse create(OrderRequest orderRequest);

    OrderResponse update(OrderRequest orderRequest, Long id);

    PaginationResponse<OrderResponse> getAllWithPagination(String keyword, int pageNumber, int pageSize);

    void hardDelete(Long id);
}
