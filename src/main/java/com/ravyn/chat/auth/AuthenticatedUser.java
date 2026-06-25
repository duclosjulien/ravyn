package com.ravyn.chat.auth;

import java.security.Principal;

public record AuthenticatedUser(Long id, String username) implements Principal {
    @Override
    public String getName() {
        return id.toString();
    }
}
