package com.web.backend_byspring.security;

import com.web.backend_byspring.repository.CustomerRepository;
import com.web.backend_byspring.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailService implements UserDetailsService {

    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDetails userDetails = customerRepository.findByEmail(username).orElse(null);
        if (userDetails == null) {
            userDetails = employeeRepository.findByEmail(username).orElseThrow(() ->
                    new UsernameNotFoundException("User with email " + username + " not found"));
        }
        return userDetails;
    }
}
