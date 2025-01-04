package com.web.backend_byspring.controller;

import com.web.backend_byspring.dto.*;
import com.web.backend_byspring.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping(value = "", produces = "application/json", consumes = "application/json")
    private ResponseEntity<Object> create(@RequestBody CustomerRequest customerRequest) {
        return new ResponseEntity<>(ApiResponse.successResponse(customerService.create(customerRequest)), HttpStatus.OK);
    }

    @PutMapping(value = "/{id}", consumes = "application/json", produces = "application/json")
    private ResponseEntity<Object> update(@RequestBody CustomerRequest customerRequest, @PathVariable Long id) {
        return new ResponseEntity<>(ApiResponse.successResponse(customerService.update(customerRequest, id)), HttpStatus.OK);
    }

    @GetMapping(value = "/verify")
    public ResponseEntity<?> verify(
            @RequestParam String email,
            @RequestParam String verificationCode) {
        CustomerRequest customerRequest = new CustomerRequest();
        customerRequest.setEmail(email);
        customerRequest.setVerficationCode(verificationCode);
        customerService.verify(customerRequest);
        return new ResponseEntity<>("User verified successfully", HttpStatus.OK);
    }

    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody CustomerRequest customerRequest) {
        return new ResponseEntity<>(ApiResponse.successResponse(customerService.login(customerRequest)), HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody CustomerRequest customerRequest) {
        customerService.forgotPassword(customerRequest);
        return new ResponseEntity<>("Password reset verification code sent to your email", HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
            customerService.resetPassword(resetPasswordRequest);
            return new ResponseEntity<>("Password reset successfully", HttpStatus.OK);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTolenRequest refreshTolenRequest) {
        return new ResponseEntity<>(ApiResponse.successResponse(customerService.refreshToken(refreshTolenRequest)), HttpStatus.OK);
    }

    @GetMapping(value = "", produces = "application/json")
    private ResponseEntity<Object> findAll() {
        return new ResponseEntity<>(customerService.getAll(), HttpStatus.OK);
    }

}
