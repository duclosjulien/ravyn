package com.ravyn.chat.exception;

public class UserAlreadyAuthenticatedException extends RuntimeException{
    public UserAlreadyAuthenticatedException(){
        super("User is already authenticated");
    }
}
