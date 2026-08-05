package com.ravyn.chat.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatUserResponse {
    private Long id;
    private String username;
    private String displayName;

    public ChatUserResponse(Long id, String username, String displayName) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
    }
}
