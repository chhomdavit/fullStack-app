package com.web.backend_byspring.controller;

import com.web.backend_byspring.dto.ApiResponse;
import com.web.backend_byspring.dto.OrderItemResponse;
import com.web.backend_byspring.service.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/order-items")
public class OrderItemController {

    private final OrderItemService orderItemService;

    @GetMapping("/{orderId}")
    private ResponseEntity<Object> getOrderItemsByOrderId(@PathVariable("orderId") Long orderId) {
        return new ResponseEntity<>(ApiResponse.successResponse(orderItemService.getOrderItemsByOrderId(orderId)), HttpStatus.OK);
    }

    @GetMapping("")
    private ResponseEntity<Object> getAll() {
        return new ResponseEntity<>(ApiResponse.successResponse(orderItemService.getAll()), HttpStatus.OK);
    }
}
