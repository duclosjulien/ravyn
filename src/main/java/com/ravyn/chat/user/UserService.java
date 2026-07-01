package com.ravyn.chat.user;

import com.ravyn.chat.exception.*;
import com.ravyn.chat.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ChatUser createUser(String username, String passwordHash) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new UsernameTakenException(username);
        }

        return userRepository.save(new ChatUser(username, passwordHash));
    }

    // utility functions

    public ChatUserResponse findUserByUsername(String username){
        ChatUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        return new ChatUserResponse(user.getId(), user.getUsername());
    }

    public Optional<ChatUser> findUserEntityByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<ChatUser> findUserEntityById(Long userId) {
        return userRepository.findById(userId);
    }

    public ChatUserResponse findUserById(Long id){
        ChatUser user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return new ChatUserResponse(user.getId(), user.getUsername());
    }

    public ChatUser ensureUserExists(Long userId){
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    public List<ChatUser> findUsersByIds(Set<Long> userIds) {
        return userRepository.findAllById(userIds);
    }
}
