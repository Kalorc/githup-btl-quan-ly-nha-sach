package com.bookstore.exception;

public class ApiException extends RuntimeException {

    public ApiException(String message) {
        super(message);
    }
}
