package com.ravyn.chat.user;

import com.ravyn.chat.repository.UserRepository;
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
    public User userLogin(@RequestBody LoginRequest request){
        String username = request.getUsername();
        Optional<User> user = userRepository.findByUsername(username);
        if(user.isEmpty())
            return createUser(username);
        return user.get();
    }

    private User createUser(String username){
        return userRepository.save(new User(username));
    }

}
