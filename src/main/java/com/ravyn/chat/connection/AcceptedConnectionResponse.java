package com.ravyn.chat.connection;

import com.ravyn.chat.user.UserSummary;

public record AcceptedConnectionResponse(Long connectionId, UserSummary connectedUser) {
}
