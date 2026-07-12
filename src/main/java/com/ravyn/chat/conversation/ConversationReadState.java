package com.ravyn.chat.conversation;

import lombok.Getter;
import jakarta.persistence.*;
import java.time.Instant;

@Getter
@Entity
public class ConversationReadState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "conversation_id", nullable = false)
    private Long  conversationId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "last_read_at")
    private Instant lastReadAt;

    public ConversationReadState() {};

    public ConversationReadState(Long conversationId, Long userId, Instant lastReadAt) {
        this.conversationId = conversationId;
        this.userId = userId;
        this.lastReadAt = lastReadAt;
    }

    public static ConversationReadState readAt(Long conversationId, Long userId, Instant lastReadAt) {
        return new ConversationReadState(conversationId, userId, lastReadAt);
    }

    public void markReadAt(Instant readAt) {
        this.lastReadAt = readAt;
    }
}
