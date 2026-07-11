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

    @Column(name = "needs_attention")
    private boolean needsAttention;

    public ConversationReadState() {};

    public ConversationReadState(Long conversationId, Long userId, boolean needsAttention) {
        this.conversationId = conversationId;
        this.userId = userId;
        this.lastReadAt = null;
        this.needsAttention = needsAttention;

    }

    public static ConversationReadState read(Long conversationId, Long userId) {
        return new ConversationReadState(conversationId, userId, false);
    }

    public static ConversationReadState unread(Long conversationId, Long userId) {
        return new ConversationReadState(conversationId, userId, true);
    }

    public void markReadAt(Instant readAt) {
        this.lastReadAt = readAt;
    }
}
