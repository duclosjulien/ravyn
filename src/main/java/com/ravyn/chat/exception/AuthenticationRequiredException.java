package com.ravyn.chat.exception;

public class AuthenticationRequiredException extends RuntimeException{
    public AuthenticationRequiredException(){
        super("Authentication is required to access this resource.");
    }
}
