package com.ravyn.chat.exception;

public class UsernameNotFoundException extends RuntimeException{
    public UsernameNotFoundException(String username){
        super("Username " + username + " not found");
    }
}
