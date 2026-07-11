package com.ravyn.chat.repository;

import com.ravyn.chat.message.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationIdOrderByCreatedAtAsc(Long conversationId);
    Optional<Message> findFirstByConversationIdOrderByCreatedAtDesc(Long conversationId);

    @Query(value = """
        SELECT EXISTS (
            SELECT 1
            FROM message m
            WHERE m.conversation_id = :conversationId
              AND m.sender_id <> :currentUserId
              AND m.created_at > :lastReadAt
        )
        """, nativeQuery = true)
    boolean existsUnreadMessage(
            @Param("conversationId") Long conversationId,
            @Param("currentUserId") Long currentUserId,
            @Param("lastReadAt") Instant lastReadAt
    );
}
