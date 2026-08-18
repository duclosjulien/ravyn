package com.ravyn.chat.connection;

import com.ravyn.chat.exception.*;
import com.ravyn.chat.user.UserService;
import com.ravyn.chat.user.UserSummary;
import jakarta.validation.constraints.NotNull;
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

    public Optional<Connection> getConnectionBetweenUserIds(@NotNull Long currentUserId, @NotNull Long otherUserId) {
        return connectionRepository.findConnectionBetweenUserIds(currentUserId, otherUserId);
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

    @Transactional
    public ConnectionResolutionResponse acceptConnection(Long userId, Long connectionId) {
        userService.ensureAuthenticatedUserExists(userId);

        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ConnectionRequestNotFoundException(connectionId));

        validateRequestReceiver(userId, connection);
        connection.accept();
        return toConnectionResolutionResponse(connection);
    }

    @Transactional
    public ConnectionResolutionResponse rejectConnection(Long currentUserId, Long connectionId) {
        userService.ensureAuthenticatedUserExists(currentUserId);

        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ConnectionRequestNotFoundException(connectionId));

        validateRequestReceiver(currentUserId, connection);
        connection.reject();
        return toConnectionResolutionResponse(connection);
    }

    @Transactional(readOnly = true)
    public List<AcceptedConnectionResponse> getAcceptedConnections(Long userId) {
        userService.ensureAuthenticatedUserExists(userId);

        List<Connection> acceptedConnections =
                connectionRepository.findConnectionsByUserIdAndStatus(userId, ConnectionStatus.ACCEPTED);

        Map<Long, UserSummary> otherUserSummaryMap = getOtherUserSummaryMap(userId, acceptedConnections);

        List<AcceptedConnectionResponse> acceptedConnectionResponses = toAcceptedConnectionResponses(userId, acceptedConnections, otherUserSummaryMap);
        acceptedConnectionResponses.sort(
                Comparator.comparing(
                        response -> response.connectedUser().getDisplayName()
                )
        );

        return acceptedConnectionResponses;
    }

    // utility methods

    private ConnectionResponse toConnectionResponse(Connection connection) {
        return new ConnectionResponse(
                connection.getId(),
                connection.getRequestSenderId(),
                connection.getRequestReceiverId(),
                connection.getStatus(),
                connection.getCreatedAt());
    }

    private ConnectionResolutionResponse toConnectionResolutionResponse(Connection connection) {
        return new ConnectionResolutionResponse(connection.getId(), connection.getStatus());
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

    private Set<Long> extractOtherUserIds(Long currentUserId, List<Connection> connections) {
        Set<Long> otherUserIds = new HashSet<>();
        for(Connection connection : connections) {
            otherUserIds.add(getOtherUserId(currentUserId, connection));
        }

        return otherUserIds;
    }

    private void validateRequestReceiver(Long currentUserId, Connection connection) {
        if(!currentUserId.equals(connection.getRequestReceiverId())) {
            throw new ConnectionRequestAccessDeniedException();
        }
    }

    private AcceptedConnectionResponse toAcceptedConnectionResponse(Connection connection, UserSummary userSummary) {
        return new AcceptedConnectionResponse(connection.getId(), userSummary);
    }

    private List<AcceptedConnectionResponse> toAcceptedConnectionResponses(Long currentUserId, List<Connection> connections, Map<Long, UserSummary> userSummaryMap) {
        List<AcceptedConnectionResponse> acceptedConnectionResponses = new ArrayList<>();

        for(Connection connection : connections) {
            acceptedConnectionResponses.add(toAcceptedConnectionResponse(connection, userSummaryMap.get(getOtherUserId(currentUserId, connection))));
        }

        return acceptedConnectionResponses;
    }

    private Long getOtherUserId(Long currentUserId, Connection connection) {
        Long requestSenderId = connection.getRequestSenderId();

        return currentUserId.equals(requestSenderId)
                ? connection.getRequestReceiverId()
                : requestSenderId;
    }

    private Map<Long, UserSummary> getOtherUserSummaryMap(Long currentUserId, List<Connection> connections) {
        Set<Long> otherUserIds = extractOtherUserIds(currentUserId, connections);

        return userService.buildUserSummaryMap(otherUserIds);
    }
}

