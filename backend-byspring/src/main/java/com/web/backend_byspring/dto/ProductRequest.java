package com.web.backend_byspring.dto;


import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ProductRequest {

    private Long id;

    private String name;

    private String description;

    private  String barcode;

    @JsonProperty(value = "category_id")
    private Integer categoryId;

    @JsonProperty(value = "product_quantity")
    private Integer productQuantity;

    @JsonProperty(value = "product_image")
    private String productImage;

    private Double price;

    @JsonProperty(value = "created_by")
    private String createdBy;

    @JsonProperty(value = "updated_by")
    private String updatedBy;

}
