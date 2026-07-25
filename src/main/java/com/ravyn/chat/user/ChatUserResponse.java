package com.ravyn.chat.user;

import com.ravyn.chat.validation.TrimmedSize;
import jakarta.validation.constraints.NotBlank;
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
