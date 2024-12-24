package com.web.backend_byspring.exception;

public class AlreadyException extends RuntimeException{
    public AlreadyException(String message) {
        super(message);
    }
}
