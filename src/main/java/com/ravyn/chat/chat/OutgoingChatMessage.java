package com.ravyn.chat.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OutgoingChatMessage {
    private Long conversationId;
    private Long senderId;
    private String senderUsername;
    private String content;

    public OutgoingChatMessage() {}

    public OutgoingChatMessage(Long conversationId, Long senderId, String senderUsername, String content) {
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.content = content;
    }
}
