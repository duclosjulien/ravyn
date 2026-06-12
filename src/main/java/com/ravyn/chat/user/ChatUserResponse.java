package com.ravyn.chat.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatUserResponse {
    private Long id;
    private String username;

    public ChatUserResponse(Long id, String username) {
        this.id = id;
        this.username = username;
    }
}
