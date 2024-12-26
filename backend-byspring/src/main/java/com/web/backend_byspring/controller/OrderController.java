package com.web.backend_byspring.controller;

import com.web.backend_byspring.constant.AppConstants;
import com.web.backend_byspring.dto.*;
import com.web.backend_byspring.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final OrderService orderService;

    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody OrderRequest orderRequest) {
        return new ResponseEntity<>(ApiResponse.successResponse(orderService.create(orderRequest)), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody OrderRequest orderRequest, @PathVariable(value = "id") Long id) {
        return new ResponseEntity<>(ApiResponse.successResponse(orderService.update(orderRequest, id)), HttpStatus.OK);
    }

    @GetMapping(value = "/order-pagination", produces = "application/json")
    public ResponseEntity<PaginationResponse<OrderResponse>> getAllWithPagination(
            @RequestParam(defaultValue = AppConstants.PAGE_NUMBER) int pageNumber,
            @RequestParam(defaultValue = AppConstants.PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String keyword) {

        if (keyword != null && !keyword.trim().isEmpty() && pageNumber > 0) {
            pageNumber = 0;
        }
        PaginationResponse<OrderResponse> orderResponse = orderService.getAllWithPagination(keyword, pageNumber, pageSize);
        return ResponseEntity.ok().body(orderResponse);
    }

    @DeleteMapping(value = "/hardDelete/{id}", produces = "application/json")
    public ResponseEntity<String> hardDelete(@PathVariable(value = "id") Long id) {
        orderService.hardDelete(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}
