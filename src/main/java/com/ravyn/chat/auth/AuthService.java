package com.ravyn.chat.auth;

import com.ravyn.chat.exception.InvalidCredentialsException;
import com.ravyn.chat.exception.UserAlreadyAuthenticatedException;
import com.ravyn.chat.user.ChatUser;
import com.ravyn.chat.user.ChatUserResponse;
import com.ravyn.chat.user.UserService;
import com.ravyn.chat.validation.TrimmedSize;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
public class AuthService {
    private final UserService userService;
    private final AuthSessionService authSessionService;
    private final PasswordEncoder passwordEncoder;


    public AuthService(UserService userService, AuthSessionService authSessionService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.authSessionService = authSessionService;
        this.passwordEncoder = passwordEncoder;
    }

    public ChatUserResponse register(
            @NotBlank @TrimmedSize(min = 2, max = 20)String username,
            String password,
            boolean alreadyAuthenticated){

        if(alreadyAuthenticated){
            throw new UserAlreadyAuthenticatedException();
        }

        String normalizedUsername = normalizeUsername(username);
        String passwordHash = passwordEncoder.encode(password);

        ChatUser newUser = userService.createUser(normalizedUsername, passwordHash);
        authSessionService.establishSessionForUser(newUser);

        return toResponse(newUser);
    }

    public ChatUserResponse login(String username, String password, boolean alreadyAuthenticated){
        if(alreadyAuthenticated){
            throw new UserAlreadyAuthenticatedException();
        }

        String normalizedUsername = normalizeUsername(username);
        ChatUser user = userService.findUserEntityByUsername(normalizedUsername)
                .orElseThrow(InvalidCredentialsException::new);

        if(!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        authSessionService.establishSessionForUser(user);
        return toResponse(user);
    }

    private String normalizeUsername(String username) {
        return username.strip();
    }

    public ChatUserResponse me(AuthenticatedUser user){
        return userService.findUserById(user.id());
    }

    private ChatUserResponse toResponse(ChatUser user){
        return new ChatUserResponse(user.getId(), user.getUsername());
    }
}
