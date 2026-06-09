package com.ravyn.chat.exception;

public class DataIntegrityException extends RuntimeException{
    public DataIntegrityException(){
        super("Server side data corruption");
    }
}
