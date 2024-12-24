package com.web.backend_byspring.service.handler;

import com.web.backend_byspring.dto.EmployeeRequest;
import com.web.backend_byspring.dto.EmployeeRespones;
import com.web.backend_byspring.enumeration.Roles;
import com.web.backend_byspring.model.Employee;
import com.web.backend_byspring.utils.DateTimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmployeeHandlerService {

    private final PasswordEncoder passwordEncoder;

    public Employee convertEmployeeRequestToEmployee(EmployeeRequest employeeRequest, Employee employee){
        employee.setFullName(employeeRequest.getFullName());
        employee.setFirstName(employeeRequest.getFirstName());
        employee.setLastName(employeeRequest.getLastName());
        employee.setPassword(passwordEncoder.encode(employeeRequest.getPassword()));
        employee.setEmail(employeeRequest.getEmail());
        employee.setPhoneNumber(employeeRequest.getPhoneNumber());
        employee.setDateOfBirth(DateTimeUtils.convertStringToDate(employeeRequest.getDateOfBirth()));
        employee.setGender(employeeRequest.getGender());
        employee.setAddress(employeeRequest.getAddress());
        employee.setRole(Roles.AUTHS);
        employee.setStatus("PENDING");
        employee.setAttempt(0);
        employee.setCreatedAt(LocalDateTime.now());
        employee.setDevices(employeeRequest.getDevices());
        return  employee;
    }

    public EmployeeRespones covertEmployeeToEmployeeResponse(Employee employee){
        return EmployeeRespones.builder()
                .id(employee.getId())
                .fullName(employee.getFullName())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .password((employee.getPassword()))
                .email(employee.getEmail())
                .phoneNumber(employee.getPhoneNumber())
                .dateOfBirth(employee.getDateOfBirth().toString())
                .gender(employee.getGender())
                .address(employee.getAddress())
                .role(employee.getRole())
                .lastLogin(employee.getLastLogin())
                .status(employee.getStatus())
                .attempt(employee.getAttempt())
                .devices(employee.getDevices())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }
}

