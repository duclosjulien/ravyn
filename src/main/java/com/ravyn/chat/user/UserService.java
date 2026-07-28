package com.ravyn.chat.user;

import com.ravyn.chat.exception.*;
import com.ravyn.chat.repository.UserRepository;
import jakarta.transaction.Transactional;
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

    // profile

    public ChatUserResponse updateDisplayName(Long userId, String newDisplayName) {
        Optional<ChatUser> user = userRepository.findById(userId);
        if(user.isEmpty()) {
            throw new AuthenticatedUserNotFoundException(userId);
        }

        ChatUser userFound = user.get();
        userFound.setDisplayName(newDisplayName.strip());
        return toChatUserResponse(userRepository.save(userFound));
    }

    // utility functions

    public ChatUserResponse findUserByUsername(String username){
        ChatUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        return toChatUserResponse(user);
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
        return toChatUserResponse(user);
    }

    public ChatUser ensureUserExists(Long userId){
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    public List<ChatUser> findUsersByIds(Set<Long> userIds) {
        return userRepository.findAllById(userIds);
    }

    private ChatUserResponse toChatUserResponse(ChatUser user) {
        return new ChatUserResponse(user.getId(), user.getUsername(), user.getDisplayName());
    }
}
