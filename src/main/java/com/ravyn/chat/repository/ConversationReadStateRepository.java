package com.ravyn.chat.repository;

import com.ravyn.chat.conversation.ConversationReadState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConversationReadStateRepository extends JpaRepository<ConversationReadState, Long> {
    Optional<ConversationReadState> findByConversationIdAndUserId(Long conversationId, Long userId);}
