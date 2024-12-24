package com.web.backend_byspring.controller;

import com.web.backend_byspring.dto.ApiResponse;
import com.web.backend_byspring.dto.EmployeeRequest;
import com.web.backend_byspring.dto.RefreshTolenRequest;
import com.web.backend_byspring.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping(value = "", produces = "application/json", consumes = "application/json")
    private ResponseEntity<Object> create(@RequestBody EmployeeRequest employeeRequest) {
        return new ResponseEntity<>(ApiResponse.successResponse(employeeService.create(employeeRequest)), HttpStatus.OK);
    }

    @PutMapping(value = "/{id}", produces = "application/json", consumes = "application/json")
    private ResponseEntity<Object> update(@RequestBody EmployeeRequest employeeRequest, @PathVariable Long id) {
        return new ResponseEntity<>(ApiResponse.successResponse(employeeService.update(employeeRequest, id)), HttpStatus.OK);
    }

    @PostMapping(value = "/login", produces = "application/json", consumes = "application/json")
    public ResponseEntity<?> login(@RequestBody EmployeeRequest employeeRequest) {
        return new ResponseEntity<>(ApiResponse.successResponse(employeeService.login(employeeRequest)), HttpStatus.OK);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTolenRequest refreshTolenRequest) {
        return new ResponseEntity<>(ApiResponse.successResponse(employeeService.refreshToken(refreshTolenRequest)), HttpStatus.OK);
    }

}
