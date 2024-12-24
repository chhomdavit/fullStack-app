package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.web.backend_byspring.model.Product;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryResponse {

    private Integer id;

    private String name;

    private String description;

    private boolean isDeleted = false;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private EmployeeRespones createdBy;

    private EmployeeRespones updatedBy;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<ProductResponse> products;
}
