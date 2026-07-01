package com.ravyn.chat.auth;

import com.ravyn.chat.user.ChatUserResponse;
import com.ravyn.chat.user.LoginRequest;
import com.ravyn.chat.user.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
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

    @PostMapping("/logout")
    public void logout(HttpServletRequest request){
        HttpSession session = request.getSession(false);
        if(session == null){
            return;
        }
        session.invalidate();
        SecurityContextHolder.clearContext();
    }
}
