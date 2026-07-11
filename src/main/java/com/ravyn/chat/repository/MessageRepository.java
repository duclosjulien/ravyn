package com.ravyn.chat.repository;

import com.ravyn.chat.message.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
              AND (:lastReadAt IS NULL OR m.created_at > :lastReadAt)
        )
        """, nativeQuery = true)
    boolean existsUnreadMessage(
            Long conversationId,
            Long currentUserId,
            Instant lastReadAt
    );
}
