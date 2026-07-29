package com.ravyn.chat.user;

import com.ravyn.chat.exception.*;
import com.ravyn.chat.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Validated
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

    public SelfProfileResponse updateDisplayName(Long userId, String newDisplayName) {
        Optional<ChatUser> user = userRepository.findById(userId);
        if(user.isEmpty()) {
            throw new AuthenticatedUserNotFoundException(userId);
        }

        ChatUser userFound = user.get();
        userFound.setDisplayName(newDisplayName.strip());
        return toSelfProfileResponse(userRepository.save(userFound));
    }

    public SelfProfileResponse getSelfProfile(Long userId) {
        ChatUser user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticatedUserNotFoundException(userId));

        return toSelfProfileResponse(user);
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

    private SelfProfileResponse toSelfProfileResponse(ChatUser user) {
        return new SelfProfileResponse(user.getId(), user.getUsername(), user.getDisplayName());
    }
}
