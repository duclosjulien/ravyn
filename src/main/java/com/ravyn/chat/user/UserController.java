package com.ravyn.chat.user;

import com.ravyn.chat.auth.AuthenticatedUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final UserSearchService userSearchService;

    public UserController(UserService userService, UserSearchService userSearchService) {
        this.userService = userService;
        this.userSearchService = userSearchService;
    }

    @GetMapping("/search")
    public UserSearchResponse findUserByUsername(@AuthenticationPrincipal AuthenticatedUser user, @RequestParam String username){
        return userSearchService.findUserByUsername(user.id(), username);
    }

    @GetMapping("/{userId}")
    public PublicProfileResponse findPublicProfileById(@PathVariable Long userId) {
        return userService.findPublicProfileById(userId);
    }
}
