package com.web.backend_byspring.dto;

import java.time.LocalDateTime;

public class ApiResponse {

    public static ApiResponseEntity createApiResponseEntity(
            String errorCode, int statusCode, String message, String errorDescription,
            Object responseData) {
        return ApiResponseEntity.builder()
                .errorCode(errorCode)
                .statusCode(statusCode)
                .message(message)
                .messageDescription(errorDescription)
                .timestamp(LocalDateTime.now())
                .responseData(responseData)
                .build();
    }

    public static ApiResponseEntity successResponse(Object object) {
        return ApiResponse.createApiResponseEntity(
                        "200",
                        200,
                        "Success",
                        "Success",
                        object);
    }
}
