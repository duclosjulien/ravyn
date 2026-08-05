package com.ravyn.chat.exception;

public class AlreadyConnectedException extends RuntimeException {
    public AlreadyConnectedException() {
        super("Connection between users already exist.");
    }
}
