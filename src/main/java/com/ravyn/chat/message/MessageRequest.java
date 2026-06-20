package com.ravyn.chat.message;

import lombok.Getter;

@Getter
public class MessageRequest {
    private Long conversationId;
    private String content;


    public MessageRequest(Long conversationId, String content) {
        this.conversationId = conversationId;
        this.content = content;
    }
}
