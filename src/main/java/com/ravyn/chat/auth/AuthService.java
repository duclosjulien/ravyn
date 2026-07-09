package com.ravyn.chat.auth;

import com.ravyn.chat.exception.AuthenticationRequiredException;
import com.ravyn.chat.exception.InvalidCredentialsException;
import com.ravyn.chat.exception.UserAlreadyAuthenticatedException;
import com.ravyn.chat.user.ChatUser;
import com.ravyn.chat.user.ChatUserResponse;
import com.ravyn.chat.user.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserService userService;
    private final AuthSessionService authSessionService;
    private final PasswordEncoder passwordEncoder;


    public AuthService(UserService userService, AuthSessionService authSessionService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.authSessionService = authSessionService;
        this.passwordEncoder = passwordEncoder;
    }

    public ChatUserResponse register(String username, String password, boolean alreadyAuthenticated){
        if(alreadyAuthenticated){
            throw new UserAlreadyAuthenticatedException();
        }

        String passwordHash = passwordEncoder.encode(password);

        ChatUser newUser = userService.createUser(username, passwordHash);
        authSessionService.establishSessionForUser(newUser);

        return toResponse(newUser);
    }

    public ChatUserResponse login(String username, String password, boolean alreadyAuthenticated){
        if(alreadyAuthenticated){
            throw new UserAlreadyAuthenticatedException();
        }

        ChatUser user = userService.findUserEntityByUsername(username)
                .orElseThrow(InvalidCredentialsException::new);

        if(!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        authSessionService.establishSessionForUser(user);
        return toResponse(user);
    }

    public ChatUserResponse me(Authentication authentication){
        if(authentication == null) {
            throw new AuthenticationRequiredException();
        }

        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        return userService.findUserById(user.id());
    }

    private ChatUserResponse toResponse(ChatUser user){
        return new ChatUserResponse(user.getId(), user.getUsername());
    }
}
