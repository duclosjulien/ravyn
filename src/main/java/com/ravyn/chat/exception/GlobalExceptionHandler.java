package com.ravyn.chat.exception;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
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

    @ExceptionHandler(MessageContentTooLongException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMessageContentTooLongException(MessageContentTooLongException exception){
        return new ErrorResponse(exception.getMessage(),  ErrorCode.MESSAGE_CONTENT_TOO_LONG);
    }

    @ExceptionHandler(EmptyMessageContentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleEmptyMessageContentException(EmptyMessageContentException exception){
        return new ErrorResponse(exception.getMessage(),  ErrorCode.EMPTY_MESSAGE_CONTENT);
    }

    @ExceptionHandler(UserAlreadyAuthenticatedException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleUserAlreadyAuthenticatedException(UserAlreadyAuthenticatedException exception){
        return new ErrorResponse(exception.getMessage(), ErrorCode.ALREADY_AUTHENTICATED);
    }

    @ExceptionHandler(AuthenticatedUserNotFoundException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleAuthenticatedUserNotFoundException(AuthenticatedUserNotFoundException exception){
        return new ErrorResponse(exception.getMessage(), ErrorCode.AUTHENTICATED_USER_NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception
    ) {
        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(FieldError::getDefaultMessage)
                .orElse("Validation failed.");

        return new ErrorResponse(message, ErrorCode.VALIDATION_FAILED);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleConstraintViolation(
            ConstraintViolationException exception
    ) {
        String message = exception.getConstraintViolations()
                .stream()
                .findFirst()
                .map(ConstraintViolation::getMessage)
                .orElse("Validation failed.");

        return new ErrorResponse(message, ErrorCode.VALIDATION_FAILED);
    }

    @ExceptionHandler(SelfConnectionException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleSelfConnectionException(SelfConnectionException exception) {
        return new ErrorResponse(exception.getMessage(), ErrorCode.CONNECTION_WITH_SELF);
    }

    @ExceptionHandler(ConnectionRequestAlreadyPendingException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleConnectionRequestAlreadyPendingException(ConnectionRequestAlreadyPendingException exception) {
        return new ErrorResponse(exception.getMessage(), ErrorCode.CONNECTION_REQUEST_ALREADY_PENDING);
    }

    @ExceptionHandler(IncomingConnectionRequestExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleIncomingConnectionRequestExistsException(IncomingConnectionRequestExistsException exception) {
        return new ErrorResponse(exception.getMessage(), ErrorCode.INCOMING_CONNECTION_REQUEST_EXISTS);
    }

    @ExceptionHandler(AlreadyConnectedException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleAlreadyConnectedException(AlreadyConnectedException exception) {
        return new ErrorResponse(exception.getMessage(), ErrorCode.ALREADY_CONNECTED);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException exception
    ) {
        Throwable cause = exception.getMostSpecificCause();
        String message = cause.getMessage();

        if (message != null && message.contains("uk_connection_users")) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(
                            "A connection relationship already exists between these users.",
                            ErrorCode.CONNECTION_RELATIONSHIP_CONFLICT
                    ));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(
                        "A database constraint was violated.",
                        ErrorCode.CORRUPTED_DATA
                ));
    }

    @ExceptionHandler(ConnectionRequestNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleConnectionNotFoundException(ConnectionRequestNotFoundException exception) {
        return new ErrorResponse(exception.getMessage(), ErrorCode.CONNECTION_REQUEST_NOT_FOUND);
    }

    @ExceptionHandler(ConnectionRequestAccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleConnectionRequestAccessDeniedException(ConnectionRequestAccessDeniedException exception) {
        return new ErrorResponse(exception.getMessage(), ErrorCode.CONNECTION_REQUEST_ACCESS_DENIED);
    }

    @ExceptionHandler(ConnectionRequestAlreadyResolvedException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleConnectionRequestAlreadyResolvedException(ConnectionRequestAlreadyResolvedException exception) {
        return new ErrorResponse(exception.getMessage(), ErrorCode.CONNECTION_REQUEST_ALREADY_RESOLVED);
    }
}
