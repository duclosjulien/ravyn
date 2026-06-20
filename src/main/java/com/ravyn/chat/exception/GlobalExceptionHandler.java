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

    @ExceptionHandler(InvalidCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleInvalidCredentialsException(InvalidCredentialsException exception){
        return new ErrorResponse(exception.getMessage(), ErrorCode.INVALID_CREDENTIALS);
    }

    @ExceptionHandler(UsernameTakenException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleUsernameTakenException(UsernameTakenException exception){
        return new ErrorResponse(exception.getMessage(), ErrorCode.USERNAME_TAKEN);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleUsernameNotFoundException(UsernameNotFoundException exception){
        return new ErrorResponse(exception.getMessage(), ErrorCode.USERNAME_NOT_FOUND);
    }

    @ExceptionHandler(AuthenticationRequiredException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleAuthenticationRequiredException(AuthenticationRequiredException exception){
        return new ErrorResponse(exception.getMessage(), ErrorCode.AUTHENTICATION_REQUIRED);
    }

    @ExceptionHandler(ConversationAccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleConversationAccessDeniedException(ConversationAccessDeniedException exception){
        return new ErrorResponse(exception.getMessage(),  ErrorCode.CONVERSATION_ACCESS_DENIED);
    }
}
