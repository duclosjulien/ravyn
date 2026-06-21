package com.ravyn.chat.auth;

import com.ravyn.chat.user.ChatUserResponse;
import com.ravyn.chat.user.LoginRequest;
import com.ravyn.chat.user.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ChatUserResponse login(@RequestBody LoginRequest request){
        return authService.login(request.getUsername(), request.getPassword());
    }

    @PostMapping("/register")
    public ChatUserResponse register(@RequestBody RegisterRequest request){
        return authService.register(request.getUsername(), request.getPassword());
    }
    @GetMapping("/me")
    public ChatUserResponse me(Authentication authentication) {
        return authService.me(authentication);
    }

}
