package com.web.backend_byspring.controller;

import com.web.backend_byspring.constant.AppConstants;
import com.web.backend_byspring.dto.*;
import com.web.backend_byspring.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @GetMapping("/get-profile")
    public ResponseEntity<ApiResponseEntity> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        EmployeeRequest employeeRequest = new EmployeeRequest();
        employeeRequest.setEmail(email);
        EmployeeRespones employeeRespones = employeeService.getMyInfo(employeeRequest);
        return new ResponseEntity<>(ApiResponse.successResponse(employeeRespones), HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<PaginationResponse<EmployeeRespones>> getAll(
            @RequestParam String keyword,
            @RequestParam(defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize) {

        PaginationResponse<EmployeeRespones> employeeRespones = employeeService.getAllWithPagination(keyword, pageNumber,pageSize);
        return ResponseEntity.ok().body(employeeRespones);
    }
}
