package com.ravyn.chat.user;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {this.userService = userService;}

    @GetMapping("/search")
    public UserSearchResponse findUserByUsername(@RequestParam String username){
        return userService.findUserByUsername(username);
    }

    @GetMapping("/{userId}")
    public PublicProfileResponse findPublicProfileById(@PathVariable Long userId) {
        return userService.findPublicProfileById(userId);
    }
}
