package com.web.backend_byspring.service.Impl;

import com.web.backend_byspring.dto.EmployeeRequest;
import com.web.backend_byspring.dto.EmployeeRespones;
import com.web.backend_byspring.dto.RefreshTolenRequest;
import com.web.backend_byspring.exception.InvalidException;
import com.web.backend_byspring.jwt.JWTUtils;
import com.web.backend_byspring.model.Employee;
import com.web.backend_byspring.repository.EmployeeRepository;
import com.web.backend_byspring.service.EmployeeService;
import com.web.backend_byspring.service.handler.EmployeeHandlerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
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
}
