package com.ravyn.chat.connection;

import com.ravyn.chat.auth.AuthenticatedUser;
import jakarta.validation.constraints.Positive;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/connections")
public class ConnectionController {
    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @PostMapping("/requests/{receiverId}")
    public ConnectionResponse requestConnection(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable @Positive Long receiverId) {

        return connectionService.requestConnection(user.id(), receiverId);
    }
}
