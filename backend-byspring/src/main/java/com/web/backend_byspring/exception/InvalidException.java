package com.web.backend_byspring.exception;

public class InvalidException extends RuntimeException{
    public InvalidException(String message) {
        super(message);
    }
}
