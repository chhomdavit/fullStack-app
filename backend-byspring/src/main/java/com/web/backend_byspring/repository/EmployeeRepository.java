package com.web.backend_byspring.repository;

import com.web.backend_byspring.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmail(String email);

    Page<Employee> findByFullNameContainingIgnoreCase(String keyword, Pageable pageable);
}
