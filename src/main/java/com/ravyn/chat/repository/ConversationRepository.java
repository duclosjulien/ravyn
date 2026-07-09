package com.ravyn.chat.repository;

import com.ravyn.chat.conversation.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByParticipantLowIdAndParticipantHighId(Long user1Id, Long user2Id);
    List<Conversation> findByParticipantLowIdOrParticipantHighId(Long user1Id, Long user2Id);
}