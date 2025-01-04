package com.web.backend_byspring.controller;

import com.web.backend_byspring.dto.ApiResponse;
import com.web.backend_byspring.enumeration.PaymentStatus;
import com.web.backend_byspring.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @PutMapping("/order/{orderId}/payment/{paymentId}")
    public ResponseEntity<?> update(
            @PathVariable(value = "paymentId") Long paymentId,
            @RequestParam(value = "paymentStatus") PaymentStatus paymentStatus
    ) {
        return new ResponseEntity<>(ApiResponse.successResponse(paymentService.update( paymentStatus, paymentId)), HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<Object> getAll() {
        return new ResponseEntity<>(ApiResponse.successResponse(paymentService.getAll()), HttpStatus.OK);
    }
}
