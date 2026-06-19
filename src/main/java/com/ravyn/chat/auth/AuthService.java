package com.ravyn.chat.auth;

import com.ravyn.chat.exception.AuthenticationRequiredException;
import com.ravyn.chat.user.ChatUserResponse;
import com.ravyn.chat.user.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserService userService;

    public AuthService(UserService userService) {
        this.userService = userService;
    }

    public ChatUserResponse me(Authentication authentication){
        if(authentication == null)
            throw new AuthenticationRequiredException();

        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        return userService.findUserById(user.id());
    }
}
