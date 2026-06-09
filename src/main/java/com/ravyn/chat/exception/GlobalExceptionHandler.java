package com.ravyn.chat.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ConversationNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleConversationNotFound(ConversationNotFoundException exception) {
        return new ErrorResponse(exception.getMessage(), ErrorCode.CONVERSATION_NOT_FOUND);
    }

    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleUserNotFoundException(UserNotFoundException exception) {
        return new ErrorResponse(exception.getMessage(), ErrorCode.USER_NOT_FOUND);
    }

    @ExceptionHandler(SelfConversationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleConversationWithSelfException(SelfConversationException exception){
        return new ErrorResponse(exception.getMessage(), ErrorCode.CONVERSATION_WITH_SELF);
    }

    @ExceptionHandler(DataIntegrityException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleDataIntegrityException(DataIntegrityException exception){
        return new ErrorResponse(exception.getMessage(), ErrorCode.CORRUPTED_DATA);
    }
}
