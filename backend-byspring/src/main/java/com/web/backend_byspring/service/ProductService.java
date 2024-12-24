package com.web.backend_byspring.service;

import com.web.backend_byspring.dto.PaginationResponse;
import com.web.backend_byspring.dto.ProductRequest;
import com.web.backend_byspring.dto.ProductResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    ProductResponse create(ProductRequest productRequest, MultipartFile file);

    ProductResponse update(ProductRequest productRequest, MultipartFile file, Long id);

    List<ProductResponse> getAll();

    PaginationResponse<ProductResponse> getAllWithPagination(String keyword, Integer categoryId, int pageNumber, int pageSize);

    void hardDelete(Long id);

    void softDelete(Long id);
}
