package com.ravyn.chat.connection;

import java.time.Instant;

public record ConnectionResponse(Long id, Long requestSenderId, Long requestReceiverId, ConnectionStatus status, Instant createdAt) {
}
