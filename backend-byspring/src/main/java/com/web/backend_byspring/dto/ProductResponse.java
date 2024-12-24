package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;

    private String name;

    private String description;

    @JsonProperty(value = "product_quantity")
    private Integer productQuantity;

    @JsonProperty(value = "product_image")
    private String productImage;

    private  String barcode;

    private Double price;

    private CategoryResponse category;

    private boolean isDeleted = false;

    @JsonProperty(value = "created_at")
    private LocalDateTime createdAt;

    @JsonProperty(value = "updated_at")
    private LocalDateTime updatedAt;

    @JsonProperty(value = "created_by")
    private EmployeeRespones createdBy;

    @JsonProperty(value = "updated_by")
    private EmployeeRespones updatedBy;
}
