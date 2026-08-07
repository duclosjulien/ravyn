package com.ravyn.chat.connection;

import com.ravyn.chat.exception.*;
import com.ravyn.chat.user.UserService;
import com.ravyn.chat.user.UserSummary;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ConnectionService {
    private final ConnectionRepository connectionRepository;
    private final UserService userService;

    public ConnectionService(ConnectionRepository connectionRepository, UserService userService) {
        this.connectionRepository = connectionRepository;
        this.userService = userService;
    }

    @Transactional
    public ConnectionResponse requestConnection(Long requestSenderId, Long requestReceiverId) {
        if(requestSenderId.equals(requestReceiverId)) {
            throw new SelfConnectionException();
        }

        userService.ensureAuthenticatedUserExists(requestSenderId);
        userService.ensureUserExists(requestReceiverId);

        Optional<Connection> existingConnection = connectionRepository.findConnectionBetweenUserIds(requestSenderId, requestReceiverId);
        if (existingConnection.isEmpty()) {
            return createConnection(requestSenderId, requestReceiverId);
        }

        Connection connection = existingConnection.get();

        switch (connection.getStatus()) {
            case PENDING -> handlePending(connection, requestSenderId);
            case ACCEPTED -> throw new AlreadyConnectedException();
            case REJECTED -> {
                connection.reopen(requestSenderId, requestReceiverId);
                return toConnectionResponse(connection);
            }
        }

        throw new IllegalStateException("Unexpected connection status");
    }

    private ConnectionResponse createConnection(Long requestSenderId, Long requestReceiverId) {
        Connection connection = connectionRepository.save(new Connection(requestSenderId, requestReceiverId));
        return toConnectionResponse(connection);
    }

    private void handlePending(Connection connection, Long requestSenderId) {
        if(connection.getRequestSenderId().equals(requestSenderId)) {
            throw new ConnectionRequestAlreadyPendingException();
        }
        throw new IncomingConnectionRequestExistsException();
    }

    @Transactional(readOnly = true)
    public List<IncomingConnectionRequestResponse> getIncomingConnectionRequests(Long userId) {
        userService.ensureAuthenticatedUserExists(userId);

        List<Connection> pendingConnections =
                connectionRepository.findByRequestReceiverIdAndStatusOrderByCreatedAtDesc(userId, ConnectionStatus.PENDING);

        return toIncomingConnectionRequestResponses(pendingConnections);
    }

    // helper methods

    private ConnectionResponse toConnectionResponse(Connection connection) {
        return new ConnectionResponse(
                connection.getId(),
                connection.getRequestSenderId(),
                connection.getRequestReceiverId(),
                connection.getStatus(),
                connection.getCreatedAt());
    }

    private List<IncomingConnectionRequestResponse> toIncomingConnectionRequestResponses(List<Connection> connections) {
        List<IncomingConnectionRequestResponse> connectionResponses = new ArrayList<>();
        Map<Long, UserSummary> userSummaryMap = userService.buildUserSummaryMap(extractSenderIds(connections));
        for(Connection connection : connections) {
            connectionResponses.add(toIncomingRequestResponse(connection, userSummaryMap.get(connection.getRequestSenderId())));
        }
        return connectionResponses;
    }

    private IncomingConnectionRequestResponse toIncomingRequestResponse(Connection connection, UserSummary userSummary) {
        return new IncomingConnectionRequestResponse(
                connection.getId(),
                connection.getStatus(),
                connection.getCreatedAt(),
                userSummary
        );
    }

    private Set<Long> extractSenderIds(List<Connection> connections) {
        Set<Long> userIds = new HashSet<>();
        for(Connection connection : connections) {
            userIds.add(connection.getRequestSenderId());
        }
        return userIds;
    }
}
