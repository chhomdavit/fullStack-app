package com.web.backend_byspring.repository;

import com.web.backend_byspring.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

//    List<Product> findAllByCategoryId(Integer categoryId);

    Page<Product> findAllByIsDeletedFalse(Pageable pageable);

    Page<Product> findAllByCategoryIdAndIsDeletedFalse(Integer categoryId, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseOrBarcodeContainingIgnoreCaseAndIsDeletedFalse(String nameKeyword, String barcodeKeyword, Pageable pageable);
}
