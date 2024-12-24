package com.web.backend_byspring.controller;

import com.web.backend_byspring.dto.ApiResponse;
import com.web.backend_byspring.dto.CategoryRequest;
import com.web.backend_byspring.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping(value = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> create(@RequestBody CategoryRequest categoryRequest) {
        return new ResponseEntity<>(ApiResponse.successResponse(categoryService.create(categoryRequest)), HttpStatus.OK);
    }

    @GetMapping(value = "", produces = "application/json")
    private ResponseEntity<Object> findAll() {
        return new ResponseEntity<>(categoryService.getAll(), HttpStatus.OK);
    }
}
