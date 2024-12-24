package com.web.backend_byspring.exception;

import com.web.backend_byspring.dto.ApiResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponseEntity> handleRuntimeException(RuntimeException ex) {
        ApiResponseEntity apiResponseEntity = ApiResponseEntity.builder()
                .errorCode("RUNTIME_ERROR")
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(apiResponseEntity, HttpStatus.BAD_REQUEST);
    }
}
