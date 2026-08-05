package com.ravyn.chat.connection;

import com.ravyn.chat.exception.*;
import com.ravyn.chat.user.UserService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

        userService.ensureUserExists(requestSenderId);
        userService.ensureUserExists(requestReceiverId);

        Optional<Connection> existingConnection = connectionRepository.findConnectionBetweenUserIds(requestSenderId, requestReceiverId);
        if (existingConnection.isEmpty()) {
            try {
                return createConnection(requestSenderId, requestReceiverId);
            } catch(DataIntegrityViolationException exception) {
                throw new ConnectionRequestAlreadyPendingException();
            }
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

    private ConnectionResponse toConnectionResponse(Connection connection) {
        return new ConnectionResponse(
                connection.getId(),
                connection.getRequestSenderId(),
                connection.getRequestReceiverId(),
                connection.getStatus(),
                connection.getCreatedAt());
    }
}
