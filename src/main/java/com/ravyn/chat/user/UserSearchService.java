package com.ravyn.chat.user;

import com.ravyn.chat.connection.Connection;
import com.ravyn.chat.connection.ConnectionRelationshipState;
import com.ravyn.chat.connection.ConnectionService;
import com.ravyn.chat.connection.ConnectionStatus;
import com.ravyn.chat.exception.CannotSearchSelfException;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserSearchService {
    private final UserService userService;
    private final ConnectionService connectionService;

    public UserSearchService(UserService userService, ConnectionService connectionService) {
        this.userService = userService;
        this.connectionService = connectionService;
    }

    public UserSearchResponse findUserByUsername(@NotNull Long currentUserId, @NotNull String otherUsername) {
        userService.ensureAuthenticatedUserExists(currentUserId);
        ChatUser otherUser = userService.findUserByUsername(otherUsername);
        Long otherUserId = otherUser.getId();

        if(currentUserId.equals(otherUserId)) {
            throw new CannotSearchSelfException();
        }

        Optional<Connection> connection = connectionService.getConnectionBetweenUserIds(currentUserId, otherUserId);

        ConnectionRelationshipState state =
                connection
                        .map(c -> getConnectionRelationshipState(currentUserId, c))
                        .orElse(ConnectionRelationshipState.NONE);

        return toUserSearchResponse(otherUser, state);
    }

    private UserSearchResponse toUserSearchResponse(@NotNull ChatUser user, @NotNull ConnectionRelationshipState state) {
        return new UserSearchResponse(userService.toUserSummary(user), state);
    }

    private ConnectionRelationshipState getConnectionRelationshipState(@NotNull Long currentUserId, @NotNull Connection connection) {
        Long requestSenderId = connection.getRequestSenderId();
        ConnectionStatus status = connection.getStatus();

        if(status == ConnectionStatus.PENDING) {
            return currentUserId.equals(requestSenderId) ? ConnectionRelationshipState.OUTGOING_PENDING : ConnectionRelationshipState.INCOMING_PENDING;
        }

        if(status == ConnectionStatus.ACCEPTED) {
            return ConnectionRelationshipState.CONNECTED;
        }

        return ConnectionRelationshipState.REJECTED;
    }
}
