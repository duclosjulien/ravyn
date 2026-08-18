package com.ravyn.chat.exception;

public class CannotSearchSelfException extends RuntimeException {
    public CannotSearchSelfException() {
        super("User cannot search for itself");
    }
}
