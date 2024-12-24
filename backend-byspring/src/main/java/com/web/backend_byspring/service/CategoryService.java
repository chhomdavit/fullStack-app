package com.web.backend_byspring.service;

import com.web.backend_byspring.dto.CategoryRequest;
import com.web.backend_byspring.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse create(CategoryRequest categoryRequest);

    CategoryResponse update(CategoryRequest categoryRequest, Integer id);

    CategoryResponse findById(Integer id);

    List<CategoryResponse> getAll();

    void softDelete( Integer id);

    void hardDelete(Integer id);
}
