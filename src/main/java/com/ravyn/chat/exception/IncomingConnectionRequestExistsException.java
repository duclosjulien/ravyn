package com.ravyn.chat.exception;

public class IncomingConnectionRequestExistsException extends RuntimeException {
    public IncomingConnectionRequestExistsException() {
        super("Incoming connection already exists.");
    }
}
