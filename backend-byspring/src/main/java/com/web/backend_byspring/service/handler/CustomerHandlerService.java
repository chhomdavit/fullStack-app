package com.web.backend_byspring.service.handler;

import com.web.backend_byspring.dto.CustomerRequest;
import com.web.backend_byspring.dto.CustomerRespones;
import com.web.backend_byspring.enumeration.Roles;
import com.web.backend_byspring.exception.AlreadyException;
import com.web.backend_byspring.model.Customer;
import com.web.backend_byspring.repository.CustomerRepository;
import com.web.backend_byspring.service.Impl.EmailServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class CustomerHandlerService {

    private final EmailServiceImpl emailServiceImpl;
    private final PasswordEncoder passwordEncoder;
    private final CustomerRepository customerRepository;

    public void sendVerificationEmail(String email, String verificationCode) {
        String subject = "Email verification";
        String verificationUrl = "http://localhost:8080/api/v1/customers/verify?email=" + email + "&verificationCode=" + verificationCode;
        String body = "<html>"
                + "<body>"
                + "<p>Your verification code is: <b>" + verificationCode + "</b></p>"
                + "<p>Click the button below to verify your account:</p>"
                + "<a href='" + verificationUrl + "' style='display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; border-radius: 4px;'>Verify Email</a>"
                + "<p>If you didn't request this, please ignore this email.</p>"
                + "</body>"
                + "</html>";
        emailServiceImpl.sendEmail(email, subject, body);
    }

    public void sendVerificationPassword(String email, String verificationCode) {
        String subject = "Email verification";
        String body =  "<html>"
                + "<body style='font-family: Arial, sans-serif; color: #333;'>"
                + "<h2 style='color: #4CAF50;'>Verification</h2>"
                + "<p>Please verify for your reset password:</p>"
                + "<h2><p style='display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; border-radius: 4px;'>Verification Code: " + verificationCode + "</p></h2>"
                + "</body>"
                + "</html>";
        emailServiceImpl.sendEmail(email, subject, body);
    }

    public String generateOTP() {
        Random random = new Random();
        int otpValue = 100000 + random.nextInt(900000);
        return String.valueOf(otpValue);
    }

    public Customer convertCustomerRequestToCustomer(CustomerRequest customerRequest, Customer customer) {

        customer.setEmail(customerRequest.getEmail());
        customer.setName(customerRequest.getName());
        customer.setPassword(passwordEncoder.encode(customerRequest.getPassword()));
        customer.setIsVerified(false);
        customer.setVerficationCode(generateOTP());
        customer.setVerficationCodeExpiresAt(LocalDateTime.now().plusHours(1));
        customer.setAttempt(0);
        customer.setStatus("PENDING");
        customer.setCreated(LocalDateTime.now());
        customer.setUpdated(LocalDateTime.now());
        customer.setLastLogin(LocalDateTime.now());
        customer.setRole(Roles.USER);
        return customer;
    }

    public CustomerRespones convertCustomerToCustomerResponse(Customer customer) {

        return CustomerRespones.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .password(customer.getPassword())
                .status(customer.getStatus())
                .isVerified(customer.getIsVerified())
                .verficationCode(customer.getVerficationCode())
                .verficationCodeExpiresAt(customer.getVerficationCodeExpiresAt())
                .attempt(customer.getAttempt())
                .created(customer.getCreated())
                .updated(customer.getUpdated())
                .lastLogin(customer.getLastLogin())
                .role(customer.getRole())
                .build();
    }
}
