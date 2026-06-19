package com.ravyn.chat.user;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ChatUserResponse userLogin(@RequestBody LoginRequest request, HttpServletRequest httpRequest){
        return userService.login(request.getUsername(), request.getPassword(), httpRequest);
    }

    @PostMapping("/register")
    public ChatUserResponse userRegister(@RequestBody RegisterRequest request, HttpServletRequest httpRequest){
        return userService.register(request.getUsername(), request.getPassword(), httpRequest );
    }

    @GetMapping("/search")
    public ChatUserResponse findUserByUsername(@RequestParam String username){
        return userService.findUserByUsername(username);
    }
}
