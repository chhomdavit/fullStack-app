package com.web.backend_byspring.service.Impl;

import com.web.backend_byspring.dto.*;
import com.web.backend_byspring.exception.InvalidException;
import com.web.backend_byspring.jwt.JWTUtils;
import com.web.backend_byspring.model.Employee;
import com.web.backend_byspring.model.Order;
import com.web.backend_byspring.repository.EmployeeRepository;
import com.web.backend_byspring.service.EmployeeService;
import com.web.backend_byspring.service.handler.EmployeeHandlerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeHandlerService employeeHandlerService;
    private final AuthenticationManager authenticationManager;
    private final JWTUtils jwtUtils;

    @Override
    public EmployeeRespones create(EmployeeRequest employeeRequest) {
        Employee employee = new Employee();
        employee = employeeHandlerService.convertEmployeeRequestToEmployee(employeeRequest, employee);
        employeeRepository.saveAndFlush(employee);
        return employeeHandlerService.covertEmployeeToEmployeeResponse(employee);
    }

    @Override
    public EmployeeRespones update(EmployeeRequest employeeRequest, Long id) {
        Optional<Employee>  optionalEmployee = employeeRepository.findById(id);
        if(optionalEmployee.isPresent()) {
            Employee updateEmployee = employeeHandlerService
                    .convertEmployeeRequestToEmployee(employeeRequest, optionalEmployee.get());
            updateEmployee.setUpdatedAt(LocalDateTime.now());
            updateEmployee.setRole(employeeRequest.getRole());
            employeeRepository.saveAndFlush(updateEmployee);
            return employeeHandlerService.covertEmployeeToEmployeeResponse(updateEmployee);
        }
        throw new InvalidException("Customer with ID " + id + " not found.");
    }

    @Override
    public EmployeeRespones login(EmployeeRequest employeeRequest) {
        Optional<Employee> optionalEmployee = employeeRepository.findByEmail(employeeRequest.getEmail());
        if (optionalEmployee.isEmpty()) {
            throw new InvalidException("Employee not found with the provided email.");
        }
        Employee employee = optionalEmployee.get();
        authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            employeeRequest.getEmail(),
                            employeeRequest.getPassword())
            );
        employee.setAttempt(0);
        employee.setStatus("ACTIVE");
        employee.setLastLogin(LocalDateTime.now());
        employeeRepository.saveAndFlush(employee);

        String jwt = jwtUtils.generateToken(employee);
        String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), employee);
        EmployeeRespones employeeRespones = employeeHandlerService.covertEmployeeToEmployeeResponse(employee);
        employeeRespones.setAccessToken(jwt);
        employeeRespones.setRefreshToken(refreshToken);
        return employeeRespones;
    }

    @Override
    public EmployeeRespones refreshToken(RefreshTolenRequest refreshTolenRequest) {
        String email = jwtUtils.extractUsername(refreshTolenRequest.getRefreshToken());
        Optional<Employee> optionalEmployee = employeeRepository.findByEmail(email);
        if (optionalEmployee.isEmpty()) {
            throw new InvalidException("Customer not found with the provided email.");
        }
        Employee employee = optionalEmployee.get();
        String newAccessToken = jwtUtils.generateToken(employee);
        String newRefreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), employee);

        EmployeeRespones employeeRespones = employeeHandlerService.covertEmployeeToEmployeeResponse(employee);
        employeeRespones.setAccessToken(newAccessToken);
        employeeRespones.setRefreshToken(newRefreshToken);

        return employeeRespones;
    }

    @Override
    public EmployeeRespones getMyInfo(EmployeeRequest employeeRequest) {
        EmployeeRespones employeeRespones = null;
        Optional<Employee> employeeOptional = employeeRepository.findByEmail(employeeRequest.getEmail());
            if (employeeOptional.isPresent()) {
                Employee employee = employeeOptional.get();
                employeeRespones = employeeHandlerService.covertEmployeeToEmployeeResponse(employee);
            }
        return employeeRespones;
    }

    @Override
    public PaginationResponse<EmployeeRespones> getAllWithPagination(String keyword, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Employee> employeePage = employeeRepository.findByFullNameContainingIgnoreCase(keyword, pageable);

        List<EmployeeRespones> employeeResponesList = employeePage.getContent().stream()
                .map(employeeHandlerService::covertEmployeeToEmployeeResponse)
                .toList();
        PaginationResponse<EmployeeRespones> paginationResponse = new PaginationResponse<>();
        paginationResponse.setList(employeeResponesList);
        paginationResponse.setPageNumber(employeePage.getNumber());
        paginationResponse.setPageSize(employeePage.getSize());
        paginationResponse.setTotalElements(employeePage.getTotalElements());
        paginationResponse.setTotalPages(employeePage.getTotalPages());
        paginationResponse.setLast(employeePage.isLast());
        return paginationResponse;
    }
}
