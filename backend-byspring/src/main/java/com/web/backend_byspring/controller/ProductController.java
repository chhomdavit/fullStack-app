package com.web.backend_byspring.controller;

import com.web.backend_byspring.constant.AppConstants;
import com.web.backend_byspring.dto.PaginationResponse;
import com.web.backend_byspring.dto.ProductRequest;
import com.web.backend_byspring.dto.ProductResponse;
import com.web.backend_byspring.dto.ApiResponse;
import com.web.backend_byspring.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = "application/json")
    public ResponseEntity<Object> create(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("category_id")  Integer categoryId,
            @RequestParam("description") String description,
            @RequestParam("product_quantity") Integer productQuantity,
            @RequestParam("created_by") String createdBy,
            @RequestParam("price") Double price) {

        ProductRequest productRequest = new ProductRequest();
        productRequest.setName(name);
        productRequest.setPrice(price);
        productRequest.setCategoryId(categoryId);
        productRequest.setDescription(description);
        productRequest.setCreatedBy(createdBy);
        productRequest.setProductQuantity(productQuantity);
        return new ResponseEntity<>(ApiResponse.successResponse(productService.create(productRequest, file)), HttpStatus.OK);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = "application/json")
    public ResponseEntity<Object> update(
            @PathVariable(value = "id") Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("category_id")  Integer categoryId,
            @RequestParam("description") String description,
            @RequestParam("created_by") String createdBy,
            @RequestParam("updated_by") String updatedBy,
            @RequestParam("product_quantity") Integer productQuantity,
            @RequestParam("price") Double price) {

        ProductRequest productRequest = new ProductRequest();
        productRequest.setName(name);
        productRequest.setPrice(price);
        productRequest.setCategoryId(categoryId);
        productRequest.setCreatedBy(createdBy);
        productRequest.setUpdatedBy(updatedBy);
        productRequest.setDescription(description);
        productRequest.setProductQuantity(productQuantity);
        return new ResponseEntity<>(ApiResponse.successResponse(productService.update(productRequest, file, id)), HttpStatus.OK);
    }

    @DeleteMapping(value = "/hardDelete/{id}", produces = "application/json")
    public ResponseEntity<String> hardDelete(@PathVariable(value = "id") Long id) {
        productService.hardDelete(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    @GetMapping(value = "", produces = "application/json")
    private ResponseEntity<Object> findAll() {
        return new ResponseEntity<>(productService.getAll(), HttpStatus.OK);
    }


    @GetMapping(value = "/product-pagination", produces = "application/json")
    public ResponseEntity<PaginationResponse<ProductResponse>> getAll(
            @RequestParam(defaultValue = AppConstants.PAGE_NUMBER) int pageNumber,
            @RequestParam(defaultValue = AppConstants.PAGE_SIZE) int pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId) {
        
        if (keyword != null && !keyword.trim().isEmpty() && pageNumber > 0 && categoryId !=null) {
            pageNumber = 0;
        }
        PaginationResponse<ProductResponse> productResponse = productService.getAllWithPagination(keyword,categoryId,pageNumber, pageSize);
        return ResponseEntity.ok().body(productResponse);
    }
}
