package com.ravyn.chat.exception;

public class AuthenticatedUserNotFoundException extends RuntimeException{
    public AuthenticatedUserNotFoundException(Long userId) {
        super("Authenticated user " + userId + " was not found.");
    }
}
