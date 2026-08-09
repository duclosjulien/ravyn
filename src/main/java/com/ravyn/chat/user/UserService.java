package com.ravyn.chat.user;

import com.ravyn.chat.exception.*;
import com.ravyn.chat.repository.UserRepository;
import com.ravyn.chat.validation.TrimmedSize;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.*;

import static com.ravyn.chat.validation.TextNormalizer.stripBoundaryWhitespace;

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

    public SelfProfileResponse updateDisplayName(
            @NotNull Long userId,
            @NotBlank @TrimmedSize(min = 2, max = 50) String newDisplayName) {

        ChatUser user = ensureAuthenticatedUserExists(userId);
        user.setDisplayName(stripBoundaryWhitespace(newDisplayName));

        return toSelfProfileResponse(userRepository.save(user));
    }

    public SelfProfileResponse getSelfProfile(@NotNull Long userId) {
        ChatUser user = ensureAuthenticatedUserExists(userId);

        return toSelfProfileResponse(user);
    }

    public PublicProfileResponse findPublicProfileById(@NotNull Long userId) {
        ChatUser user = ensureUserExists(userId);
        return toPublicProfileResponse(user);
    }

    // utility functions

    public UserSearchResponse findUserByUsername(String username){
        ChatUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        return toUserSummaryResponse(user);
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

    public ChatUser ensureAuthenticatedUserExists(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticatedUserNotFoundException(userId));
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

    private UserSearchResponse toUserSummaryResponse(ChatUser user) {
        return new UserSearchResponse(user.getId(), user.getUsername(), user.getDisplayName());
    }

    private PublicProfileResponse toPublicProfileResponse(ChatUser user) {
        return new PublicProfileResponse(user.getId(), user.getUsername(), user.getDisplayName());
    }

    public UserSummary toUserSummary(ChatUser user) {
        return new UserSummary(
                user.getId(),
                user.getUsername(),
                user.getDisplayName());
    }

    public Map<Long, UserSummary> buildUserSummaryMap(Set<Long> userIds) {
        List<ChatUser> users = userRepository.findAllById(userIds);
        Map<Long, UserSummary> chatUserSummaryMap = new HashMap<>();

        for(ChatUser user : users) {
            chatUserSummaryMap.put(
                    user.getId(),
                    toUserSummary(user));
        }

        if (chatUserSummaryMap.size() != userIds.size()) {
            throw new DataIntegrityException();
        }

        return chatUserSummaryMap;
    }
}
