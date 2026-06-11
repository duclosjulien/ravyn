package com.ravyn.chat.user;

import com.ravyn.chat.exception.InvalidCredentialsException;
import com.ravyn.chat.exception.UserNotFoundException;
import com.ravyn.chat.exception.UsernameTakenException;
import com.ravyn.chat.repository.UserRepository;
import jakarta.persistence.Entity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ChatUserResponse userLogin(@RequestBody LoginRequest request){
        String username = request.getUsername();
        ChatUser user = userRepository.findByUsername(username)
                .orElseThrow(InvalidCredentialsException::new);
        String passwordToHash = request.getPassword();
        // TODO tomorrow: passwordEncoder.matches(request.getPassword(), user.getPasswordHash())
        if(!passwordToHash.equals(user.getPasswordHash()))
            throw new InvalidCredentialsException();

        return new ChatUserResponse(user.getId(), user.getUsername());
    }

    @PostMapping("/register")
    public ChatUserResponse userRegister(@RequestBody RegisterRequest request){
        String username = request.getUsername();
        if(userRepository.findByUsername(username).isPresent())
            throw new UsernameTakenException(username);

        // to do, hash the password before creating the user
        return createUser(username, request.getPassword());
    }

    private ChatUserResponse createUser(String username, String passwordHash){
        ChatUser newUser = userRepository.save(new ChatUser(username, passwordHash));
        return new ChatUserResponse(newUser.getId(), newUser.getUsername());
    }

    @GetMapping("/search")
    public ResponseEntity<UserSummary> findUserByUsername(@RequestParam String username){
        Optional<ChatUser> user = userRepository.findByUsername(username);
        if(user.isEmpty())
            return ResponseEntity.notFound().build();
        ChatUser userFound = user.get();
        return ResponseEntity.ok(new UserSummary(userFound.getId(), userFound.getUsername()));
    }
}
