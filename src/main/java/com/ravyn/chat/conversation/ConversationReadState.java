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

    public ConversationReadState(Long conversationId, Long userId) {
        this.conversationId = conversationId;
        this.userId = userId;
        this.lastReadAt = null;
    }

    public void markReadAt(Instant readAt) {
        this.lastReadAt = readAt;
    }
}
