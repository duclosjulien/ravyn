package com.ravyn.chat.user;

import com.ravyn.chat.auth.AuthenticatedUser;
import com.ravyn.chat.exception.AuthenticationRequiredException;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@Valid
public class ProfileController {
    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @PatchMapping
    public SelfProfileResponse updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {

        AuthenticatedUser authenticatedUser =   requireAuthenticatedUser(authentication);

        return userService.updateDisplayName(authenticatedUser.id(), request.displayName());
    }

    private AuthenticatedUser requireAuthenticatedUser(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new AuthenticationRequiredException();
        }

        return user;
    }

    @GetMapping
    public SelfProfileResponse getSelfProfile(Authentication authentication){
        AuthenticatedUser authenticatedUser = requireAuthenticatedUser(authentication);
        return userService.getSelfProfile(authenticatedUser.id());

    }

}
