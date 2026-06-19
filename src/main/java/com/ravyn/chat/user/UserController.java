package com.ravyn.chat.user;

import com.ravyn.chat.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ChatUserResponse userLogin(@RequestBody LoginRequest request, HttpServletRequest httpRequest){
        return userService.login(request.getUsername(), request.getPassword(), httpRequest);
    }

    @PostMapping("/register")
    public ChatUserResponse userRegister(@RequestBody RegisterRequest request){
        return userService.register(request.getUsername(), request.getPassword());
    }

    @GetMapping("/search")
    public UserSummary findUserByUsername(@RequestParam String username){
        return userService.findUserByUsername(username);
    }
}
