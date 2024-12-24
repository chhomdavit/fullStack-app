package com.web.backend_byspring.service.Impl;

import com.web.backend_byspring.dto.CustomerRequest;
import com.web.backend_byspring.dto.CustomerRespones;
import com.web.backend_byspring.dto.RefreshTolenRequest;
import com.web.backend_byspring.dto.ResetPasswordRequest;
import com.web.backend_byspring.exception.AlreadyException;
import com.web.backend_byspring.exception.InvalidException;
import com.web.backend_byspring.jwt.JWTUtils;
import com.web.backend_byspring.model.Customer;
import com.web.backend_byspring.repository.CustomerRepository;
import com.web.backend_byspring.service.CustomerService;
import com.web.backend_byspring.service.handler.CustomerHandlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerHandlerService customerHandlerService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtils jwtUtils;


    @Override
    public CustomerRespones create(CustomerRequest customerRequest) {
        Optional<Customer> existingUserByEmail = customerRepository.findByEmail(customerRequest.getEmail());
        if (existingUserByEmail.isPresent()) {
            throw new AlreadyException("Email Already Registered");
        }
        Customer customer = new Customer();
        customer = customerHandlerService.convertCustomerRequestToCustomer(customerRequest, customer);
        customerRepository.saveAndFlush(customer);
        customerHandlerService.sendVerificationEmail(customer.getEmail(), customer.getVerficationCode());
        return customerHandlerService.convertCustomerToCustomerResponse(customer);
    }

    @Override
    public CustomerRespones update(CustomerRequest customerRequest, Long id) {
        Optional<Customer> optionalCustomer = customerRepository.findById(id);
        if (optionalCustomer.isPresent()) {
            Customer updateCustomer = optionalCustomer.get();
            updateCustomer.setName(customerRequest.getName());
            updateCustomer.setEmail(customerRequest.getEmail());
            updateCustomer.setUpdated(LocalDateTime.now());
            customerRepository.save(updateCustomer);
            return customerHandlerService.convertCustomerToCustomerResponse(updateCustomer);
        }
        throw new InvalidException("Customer with ID " + id + " not found.");
    }

    @Override
    public void verify(CustomerRequest customerRequest) {

        Optional<Customer> optionalCustomer = customerRepository.findByEmail(customerRequest.getEmail());
        if (optionalCustomer.isEmpty()) {
            throw new InvalidException("Customer not found with the provided email.");
        }
        Customer customer = optionalCustomer.get();
        customer.setStatus("ACTIVE");
        customer.setIsVerified(true);
        customer.setVerficationCode(null);
        customer.setVerficationCodeExpiresAt(null);
        customerRepository.saveAndFlush(customer);
    }

    @Override
    public CustomerRespones login(CustomerRequest customerRequest) {
        Optional<Customer> optionalCustomer = customerRepository.findByEmail(customerRequest.getEmail());
        if (optionalCustomer.isEmpty()) {
            throw new InvalidException("Customer not found with the provided email.");
        }
        Customer customer = optionalCustomer.get();
        if (Boolean.FALSE.equals(customer.getIsVerified())) {
            throw new InvalidException("Login successful, but please verify your email.");
        }
        if ("LOCKED".equals(customer.getStatus()) && customer.getLastLogin() != null) {
            if (LocalDateTime.now().isBefore(customer.getLastLogin().plusMinutes(1))) {
                throw new RuntimeException("Login successful, but please verify your email.");
            } else {
                customer.setStatus("ACTIVE");
                customer.setAttempt(0);
            }
        }
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            customerRequest.getEmail(),
                            customerRequest.getPassword())
            );
            customer.setAttempt(0);
            customer.setStatus("ACTIVE");
            customer.setLastLogin(LocalDateTime.now());
            customerRepository.saveAndFlush(customer);

            String jwt = jwtUtils.generateToken(customer);
            String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), customer);
            CustomerRespones customerRespones = customerHandlerService.convertCustomerToCustomerResponse(customer);
                             customerRespones.setAccessToken(jwt);
                             customerRespones.setRefreshToken(refreshToken);
            return customerRespones;
        } catch (Exception e) {
            int attempts = customer.getAttempt() + 1;
            customer.setAttempt(attempts);
            if (attempts >= 3) {
                customer.setStatus("LOCKED");
                customer.setLastLogin(LocalDateTime.now());
            }
            customerRepository.saveAndFlush(customer);
            throw new RuntimeException("Invalid email or password. Attempt " + attempts + " of 3.");
        }
    }

    @Override
    public void forgotPassword(CustomerRequest customerRequest) {
        Optional<Customer> optionalCustomer = customerRepository.findByEmail(customerRequest.getEmail());
        if (optionalCustomer.isEmpty()) {
            throw new InvalidException("Customer not found with the provided email.");
        }
        Customer customer = optionalCustomer.get();
        String verificationCode = customerHandlerService.generateOTP();
        customer.setVerficationCode(verificationCode);
        customer.setVerficationCodeExpiresAt(LocalDateTime.now().plusMinutes(2));
        customerRepository.saveAndFlush(customer);
        customerHandlerService.sendVerificationPassword(customer.getEmail(), verificationCode);
    }

    @Override
    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
        Optional<Customer> optionalCustomer = customerRepository.findByEmail(resetPasswordRequest.getEmail());
        if (optionalCustomer.isEmpty()) {
            throw new InvalidException("Customer not found with the provided email.");
        }
        Customer customer = optionalCustomer.get();
        if (resetPasswordRequest.getVerficationCode().equals(customer.getVerficationCode())
                && LocalDateTime.now().isBefore(customer.getVerficationCodeExpiresAt())) {
            customer.setPassword(passwordEncoder.encode(resetPasswordRequest.getNewPassword()));
            customer.setVerficationCode(null);
            customerRepository.saveAndFlush(customer);
        } else {
            throw new RuntimeException("Invalid or expired verification code.");
        }
    }

    @Override
    public CustomerRespones refreshToken(RefreshTolenRequest refreshTolenRequest) {
        String email = jwtUtils.extractUsername(refreshTolenRequest.getRefreshToken());
        Optional<Customer> optionalCustomer = customerRepository.findByEmail(email);
        if (optionalCustomer.isEmpty()) {
            throw new InvalidException("Customer not found with the provided email.");
        }
        Customer customer = optionalCustomer.get();
        String newAccessToken = jwtUtils.generateToken(customer);
        String newRefreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), customer);

        CustomerRespones customerRespones = customerHandlerService.convertCustomerToCustomerResponse(customer);
                         customerRespones.setAccessToken(newAccessToken);
                         customerRespones.setRefreshToken(newRefreshToken);

        return customerRespones;
    }


}