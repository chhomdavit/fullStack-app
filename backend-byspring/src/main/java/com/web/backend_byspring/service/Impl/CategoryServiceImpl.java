package com.web.backend_byspring.service.Impl;

import com.web.backend_byspring.dto.CategoryRequest;
import com.web.backend_byspring.dto.CategoryResponse;
import com.web.backend_byspring.dto.ProductResponse;
import com.web.backend_byspring.model.Category;
import com.web.backend_byspring.model.Product;
import com.web.backend_byspring.repository.CategoryRepository;
import com.web.backend_byspring.service.CategoryService;
import com.web.backend_byspring.service.handler.CategoryHandlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryHandlerService categoryHandlerService;

    @Override
    public CategoryResponse create(CategoryRequest categoryRequest) {

        Category category = new Category();
        category = categoryHandlerService.convertCategoryRequestToCategory(categoryRequest,category);
        categoryRepository.saveAndFlush(category);
        return categoryHandlerService.convertCategoryToCategoryResponse(category);
    }

    @Override
    public CategoryResponse update(CategoryRequest categoryRequest, Integer id) {
        return null;
    }

    @Override
    public CategoryResponse findById(Integer id) {
        return null;
    }

    @Override
    public List<CategoryResponse> getAll() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryResponse> categoryResponses = new ArrayList<>();
        for(Category category : categories) {
            categoryResponses.add(categoryHandlerService.convertCategoryToCategoryResponse(category));
        }
        return categoryResponses;
    }

    @Override
    public void softDelete(Integer id) {

    }

    @Override
    public void hardDelete(Integer id) {

    }
}
