package com.web.backend_byspring.service.Impl;

import com.web.backend_byspring.dto.FileRespones;
import com.web.backend_byspring.dto.PaginationResponse;
import com.web.backend_byspring.dto.ProductRequest;
import com.web.backend_byspring.dto.ProductResponse;
import com.web.backend_byspring.exception.InvalidException;
import com.web.backend_byspring.model.Product;
import com.web.backend_byspring.repository.ProductRepository;
import com.web.backend_byspring.service.FileUploadService;
import com.web.backend_byspring.service.ProductService;
import com.web.backend_byspring.service.handler.ProductHandlerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final FileUploadService fileUploadService;
    private final ProductHandlerService productHandlerService;

    @Value("${project.upload}")
    private String path;
    @Value("${base.url}")
    private String baseUrl;

    @Override
    public ProductResponse create(ProductRequest productRequest, MultipartFile file) {
        if (productRequest.getName() == null || productRequest.getName().isEmpty()) {
            throw new InvalidException("name cannot be null or empty");
        }
        Product product = new Product();
        product = productHandlerService.convertProductRequestToProduct(productRequest, product);
        if (file != null && !file.isEmpty()) {
            FileRespones fileResponse = fileUploadService.uploadSingle(file, path);
            product.setProductImage(fileResponse.getName());
        }
        productRepository.saveAndFlush(product);
        return productHandlerService.convertProductToProductResponse(product);
    }

    @Override
    public ProductResponse update(ProductRequest productRequest, MultipartFile file, Long id) {
        Optional<Product> product = productRepository.findById(id);
        if(product.isPresent()) {
            Product updateProduct  = productHandlerService.convertProductRequestToProduct(productRequest, product.get());
            String newSaveFile = null;
            try {
                if (file != null && !file.isEmpty()) {
                    if (updateProduct.getProductImage() != null && !updateProduct.getProductImage().isEmpty()) {
                        Files.deleteIfExists(Paths.get(path, updateProduct.getProductImage()));
                    }
                    FileRespones fileResponse = fileUploadService.uploadSingle(file, path);
                    newSaveFile = fileResponse.getName();
                } else {
                    newSaveFile = updateProduct.getProductImage();
                }
            } catch (Exception e) {
                throw new RuntimeException("Error occurred while updating product", e);
            }
            updateProduct.setProductImage(newSaveFile);
            updateProduct.setUpdatedAt(LocalDateTime.now());
            updateProduct.setUpdatedBy(productRequest.getUpdatedBy());
            productRepository.saveAndFlush(updateProduct);
            return productHandlerService.convertProductToProductResponse(updateProduct);
        }
        return new ProductResponse();
    }

    @Override
    public List<ProductResponse> getAll() {
        List<Product> products = productRepository.findAll();
        if(products.isEmpty()) {
            return List.of();
        }

        List<ProductResponse> prouctResponses = new ArrayList<>();
        for(Product product : products) {
            prouctResponses.add(productHandlerService.convertProductToProductResponse(product));
        }
        return prouctResponses;
    }

    @Override
    public PaginationResponse<ProductResponse> getAllWithPagination(String keyword, Integer categoryId, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Product> productPages;

        if (keyword != null && !keyword.trim().isEmpty()) {
            productPages = productRepository.findByNameContainingIgnoreCaseOrBarcodeContainingIgnoreCaseAndIsDeletedFalse(keyword,keyword, pageable);
        } else if (categoryId != null) {
            productPages = productRepository.findAllByCategoryIdAndIsDeletedFalse(categoryId, pageable);
        } else {
            productPages = productRepository.findAllByIsDeletedFalse(pageable);
        }

        List<ProductResponse> productResponseList = productPages.getContent().stream()
                .map(productHandlerService::convertProductToProductResponse)
                .toList();

        PaginationResponse<ProductResponse> paginationResponse = new PaginationResponse<>();
        paginationResponse.setList(productResponseList);
        paginationResponse.setPageNumber(productPages.getNumber());
        paginationResponse.setPageSize(productPages.getSize());
        paginationResponse.setTotalElements(productPages.getTotalElements());
        paginationResponse.setTotalPages(productPages.getTotalPages());
        paginationResponse.setLast(productPages.isLast());

        return paginationResponse;
    }

    @Override
    public void hardDelete(Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            String fileName = product.getProductImage();
            if (fileName != null && !fileName.isEmpty()) {
                try {
                    Files.deleteIfExists(Paths.get(path, fileName));
                } catch (IOException e) {
                    throw new RuntimeException("Error occurred while deleting file: " + fileName, e);
                }
            }
            productRepository.deleteById(id);
        }
    }

    @Override
    public void softDelete(Long id) {

    }
}