package com.web.backend_byspring.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CategoryRequest {

    private String name;

    private String description;

    @JsonProperty(value = "created_by")
    private String createdBy;

    @JsonProperty(value = "updated_by")
    private String updatedBy;

}
