package com.ravyn.chat.auth;

import com.ravyn.chat.exception.AuthenticatedUserNotFoundException;
import com.ravyn.chat.exception.InvalidCredentialsException;
import com.ravyn.chat.exception.UserAlreadyAuthenticatedException;
import com.ravyn.chat.repository.UserRepository;
import com.ravyn.chat.user.ChatUser;
import com.ravyn.chat.user.ChatUserResponse;
import com.ravyn.chat.user.UserService;
import com.ravyn.chat.validation.TrimmedSize;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import static com.ravyn.chat.validation.TextNormalizer.stripBoundaryWhitespace;

@Service
@Validated
public class AuthService {
    private final UserService userService;
    private final AuthSessionService authSessionService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;


    public AuthService(UserService userService, AuthSessionService authSessionService, PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.userService = userService;
        this.authSessionService = authSessionService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public ChatUserResponse register(
            @NotBlank @TrimmedSize(min = 2, max = 20) String username,
            @NotBlank @Size(min = 8, max = 72) String password,
            boolean alreadyAuthenticated){

        if(alreadyAuthenticated){
            throw new UserAlreadyAuthenticatedException();
        }

        String normalizedUsername = normalizeUsername(username);
        String passwordHash = passwordEncoder.encode(password);

        ChatUser newUser = userService.createUser(normalizedUsername, passwordHash);
        authSessionService.establishSessionForUser(newUser);

        return toChatUserResponse(newUser);
    }

    public ChatUserResponse login(String username, String password, boolean alreadyAuthenticated){
        if (username == null || password == null) {
            throw new InvalidCredentialsException();
        }

        if(alreadyAuthenticated){
            throw new UserAlreadyAuthenticatedException();
        }

        String normalizedUsername = normalizeUsername(username);
        ChatUser user = userService.findUserEntityByUsername(normalizedUsername)
                .orElseThrow(InvalidCredentialsException::new);

        if(!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        authSessionService.establishSessionForUser(user);
        return toChatUserResponse(user);
    }

    private String normalizeUsername(String username) {
        return stripBoundaryWhitespace(username);
    }

    public ChatUserResponse me(AuthenticatedUser user){
        return userService.findUserById(user.id());
    }

    private ChatUserResponse toChatUserResponse(ChatUser user){
        return new ChatUserResponse(user.getId(), user.getUsername(), user.getDisplayName());
    }

    public void changePassword(
            Long userId,
            @NotBlank String currentPassword,
            @NotBlank @Size(min = 8, max = 72) String newPassword) {

        ChatUser user = userService.findUserEntityById(userId)
                .orElseThrow(() -> new AuthenticatedUserNotFoundException(userId));

        if(!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        String passwordHash = passwordEncoder.encode(newPassword);
        user.setPasswordHash(passwordHash);
        userRepository.save(user);
    }
}
