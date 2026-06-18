package com.ravyn.chat.message;

import lombok.Getter;

@Getter
public class MessageRequest {
    private Long conversationId;
    private Long senderId;
    private String content;


    public MessageRequest(Long conversationId, Long senderId, String content) {
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.content = content;
    }
}
