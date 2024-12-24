package com.web.backend_byspring.service.handler;

import com.web.backend_byspring.dto.CategoryResponse;
import com.web.backend_byspring.dto.EmployeeRespones;
import com.web.backend_byspring.dto.ProductRequest;
import com.web.backend_byspring.dto.ProductResponse;
import com.web.backend_byspring.enumeration.Roles;
import com.web.backend_byspring.model.Category;
import com.web.backend_byspring.model.Employee;
import com.web.backend_byspring.model.Product;
import com.web.backend_byspring.repository.CategoryRepository;
import com.web.backend_byspring.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductHandlerService {

    private final CategoryRepository categoryRepository;
    private final EmployeeRepository employeeRepository;

    private String generateBracode() {
        Random random = new Random();
        int otpValue = 1000 + random.nextInt(9000);
        return String.valueOf(otpValue);
    }

    public Product convertProductRequestToProduct(ProductRequest productRequest, Product product) {
        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found for ID: " + productRequest.getCategoryId()));

        Employee employee = employeeRepository.findById(Long.valueOf(productRequest.getCreatedBy()))
                .orElseThrow(() -> new IllegalArgumentException("Employee not found for ID: " + productRequest.getCreatedBy()));

        if (productRequest.getUpdatedBy() != null && !productRequest.getUpdatedBy().equals(product.getCreatedBy())) {
            Employee updater = employeeRepository.findById(Long.valueOf(productRequest.getUpdatedBy()))
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found for ID: " + productRequest.getUpdatedBy()));

            if (!Roles.ADMIN.equals(updater.getRole())) {
                throw new RuntimeException("Unauthorized: Only admins or the product creator can update this product.");
            }
        }

        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setProductQuantity(productRequest.getProductQuantity());
        if (product.getBarcode() == null || product.getBarcode().isEmpty()) {
            product.setBarcode(generateBracode());
        }
        product.setDeleted(false);
        product.setCategory(category);
        if(product.getId() == null){
            product.setCreatedBy(String.valueOf(employee.getId()));
            product.setCreatedAt(LocalDateTime.now());
        }
        product.setPrice(productRequest.getPrice());
        return product;
    }

    public ProductResponse convertProductToProductResponse(Product product) {
        Employee createdByEmployee = employeeRepository.findById(Long.valueOf(product.getCreatedBy()))
                .orElseThrow(() -> new IllegalArgumentException("Employee not found for ID: " + product.getCreatedBy()));

        Employee updatedByEmployee = null;
        if (product.getUpdatedBy() != null) {
            updatedByEmployee = employeeRepository.findById(Long.valueOf(product.getUpdatedBy()))
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found for ID: " + product.getUpdatedBy()));
        }

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .productQuantity(product.getProductQuantity())
                .productImage(product.getProductImage())
                .price(product.getPrice())
                .barcode(product.getBarcode())
                .category(CategoryResponse.builder()
                        .id(product.getCategory().getId())
                        .name(product.getCategory().getName())
                        .build())
                .isDeleted(product.isDeleted())
                .createdBy(EmployeeRespones.builder()
                        .id(createdByEmployee.getId())
                        .fullName(createdByEmployee.getFullName())
                        .build())
                .updatedBy(updatedByEmployee != null ? EmployeeRespones.builder()
                        .id(updatedByEmployee.getId())
                        .fullName(updatedByEmployee.getFullName())
                        .build() : null)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
