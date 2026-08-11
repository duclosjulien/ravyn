package com.ravyn.chat.user;

import com.ravyn.chat.connection.ConnectionRelationshipState;

public record UserSearchResponse(UserSummary user, ConnectionRelationshipState relationshipState, Long connectionId) {}
