package com.web.backend_byspring.service.handler;

import com.web.backend_byspring.dto.CategoryRequest;
import com.web.backend_byspring.dto.CategoryResponse;
import com.web.backend_byspring.dto.EmployeeRespones;
import com.web.backend_byspring.dto.ProductResponse;
import com.web.backend_byspring.enumeration.Roles;
import com.web.backend_byspring.model.Category;
import com.web.backend_byspring.model.Employee;
import com.web.backend_byspring.model.Product;
import com.web.backend_byspring.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryHandlerService {

    private final EmployeeRepository employeeRepository;

    public Category convertCategoryRequestToCategory(CategoryRequest categoryRequest, Category category) {

        Employee employee = employeeRepository.findById(Long.valueOf(categoryRequest.getCreatedBy()))
                .orElseThrow(() -> new IllegalArgumentException("Employee not found for ID: " + categoryRequest.getCreatedBy()));
        if (!Roles.ADMIN.equals(employee.getRole())) {
            throw new RuntimeException("Unauthorized: Only admins  can create this.");
        }

        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());
        category.setDeleted(false);
        if(category.getId() == null){
            category.setCreatedAt(LocalDateTime.now());
            category.setCreatedBy(categoryRequest.getCreatedBy());
        }
        return category;
    }

    public CategoryResponse convertCategoryToCategoryResponse(Category category) {

        Employee createdByEmployee = employeeRepository.findById(Long.valueOf(category.getCreatedBy()))
                .orElseThrow(() -> new IllegalArgumentException("Employee not found for ID: " + category.getCreatedBy()));

        Employee updatedByEmployee = null;
        if (category.getUpdatedBy() != null) {
            updatedByEmployee = employeeRepository.findById(Long.valueOf(category.getUpdatedBy()))
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found for ID: " + category.getUpdatedBy()));
        }


        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .isDeleted(category.isDeleted())
                .products(category.getProduct() != null ? category.getProduct()
                        .stream()
                        .map(this::convertProductToProductResponse)
                        .collect(Collectors.toList()) : null)
                .createdBy(EmployeeRespones.builder()
                        .id(createdByEmployee.getId())
                        .fullName(createdByEmployee.getFullName())
                        .build())
                .updatedBy(updatedByEmployee != null ? EmployeeRespones.builder()
                        .id(updatedByEmployee.getId())
                        .fullName(updatedByEmployee.getFullName())
                        .build() : null)
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    public ProductResponse convertProductToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .productQuantity(product.getProductQuantity())
                .productImage(product.getProductImage())
                .price(product.getPrice())
                .barcode(product.getBarcode())
                .build();
    }
}

