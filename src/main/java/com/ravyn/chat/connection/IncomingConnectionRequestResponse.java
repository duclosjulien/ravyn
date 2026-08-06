package com.ravyn.chat.connection;

import com.ravyn.chat.user.UserSummary;

import java.time.Instant;

public record IncomingConnectionRequestResponse(
        Long id,
        ConnectionStatus status,
        Instant createdAt,
        UserSummary requestSenderSummary
) {
}
