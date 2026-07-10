package com.ravyn.chat.repository;

import com.ravyn.chat.conversation.ConversationReadState;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversationReadStateRepository extends JpaRepository<ConversationReadState, Long> {
}
