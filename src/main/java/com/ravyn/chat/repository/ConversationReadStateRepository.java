package com.ravyn.chat.repository;

import com.ravyn.chat.conversation.ConversationReadState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface ConversationReadStateRepository extends JpaRepository<ConversationReadState, Long> {
    Optional<ConversationReadState> findByConversationIdAndUserId(Long conversationId, Long userId);

    @Modifying
    @Query(value = """
        INSERT INTO conversation_read_state (conversation_id, user_id, last_read_at)
        VALUES (:conversationId, :userId, :readAt)
        ON CONFLICT (conversation_id, user_id)
        DO UPDATE SET last_read_at = GREATEST(conversation_read_state.last_read_at, EXCLUDED.last_read_at)
        """, nativeQuery = true)
    void upsertReadState(
            @Param("conversationId") Long conversationId,
            @Param("userId") Long userId,
            @Param("readAt") Instant readAt
    );
}
