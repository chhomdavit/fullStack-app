package com.web.backend_byspring.config;

import com.web.backend_byspring.enumeration.Roles;
import com.web.backend_byspring.model.Employee;
import com.web.backend_byspring.repository.EmployeeRepository;
import com.web.backend_byspring.utils.DateTimeUtils;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class OwerAdminConfig {

    @Bean
    public CommandLineRunner createAdminUser(EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (employeeRepository.count() == 0) {
                Employee admin = new Employee();
                admin.setFullName("Chhom Davit");
                admin.setFirstName("Chhom");
                admin.setLastName("Davit");
                admin.setEmail("chhomdavit@gmail.com");
                admin.setPhoneNumber("070668575");
                admin.setAddress("ភូមិទ្រា សង្កាត់ស្ទឹងមានជ័យ ខណ្ខមានជ័យ ក្រុងភ្នំពេញ");
                admin.setGender("1");
                admin.setDateOfBirth(DateTimeUtils.convertStringToDate("1992-10-04"));
                admin.setRole(Roles.ADMIN);
                admin.setPassword(passwordEncoder.encode("123456"));
                admin.setCreatedAt(LocalDateTime.now());
                employeeRepository.save(admin);
                System.out.println("Admin account created successfully!");
            }
        };
    }
}