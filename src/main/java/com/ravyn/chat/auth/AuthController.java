package com.ravyn.chat.auth;

import com.ravyn.chat.exception.AuthenticationRequiredException;
import com.ravyn.chat.user.ChangePasswordRequest;
import com.ravyn.chat.user.ChatUserResponse;
import com.ravyn.chat.user.LoginRequest;
import com.ravyn.chat.user.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ChatUserResponse login(@Valid @RequestBody LoginRequest request, Authentication authentication){
        return authService.login(
                request.getUsername(),
                request.getPassword(),
                isAlreadyAuthenticated(authentication));
    }

    @PostMapping("/register")
    public ChatUserResponse register(@Valid @RequestBody RegisterRequest request, Authentication authentication){
        return authService.register(
                request.getUsername(),
                request.getPassword(),
                isAlreadyAuthenticated(authentication));
    }

    private boolean isAlreadyAuthenticated(Authentication authentication){
        return authentication != null &&
        authentication.isAuthenticated() &&
        authentication.getPrincipal() instanceof AuthenticatedUser;
    }

    @GetMapping("/me")
    public ChatUserResponse me(Authentication authentication) {
        return authService.me(requireAuthenticatedUser(authentication));
    }

    private AuthenticatedUser requireAuthenticatedUser(Authentication authentication) {
        if (!isAlreadyAuthenticated(authentication)) {
            throw new AuthenticationRequiredException();
        }

        return (AuthenticatedUser) authentication.getPrincipal();
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        new SecurityContextLogoutHandler().logout(request, response, authentication);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PatchMapping("/password")
    public void changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {

        AuthenticatedUser authenticatedUser = requireAuthenticatedUser(authentication);

        authService.changePassword(
                authenticatedUser.id(),
                request.currentPassword(),
                request.newPassword()
        );
    }
}
