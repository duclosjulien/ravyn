package com.ravyn.chat.conversation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ConversationService {
    Long numbersOfIds = 1L;
    private final Map<Long, Conversation> conversations = new HashMap<>();

    public Conversation getOrCreateConversation(Long user1, Long user2) {
        Long id = makeConversationId();

        if (!conversations.containsKey(id))
            conversations.put(id, new Conversation(id, user1, user2));

        return conversations.get(id);
    }

    public interface ConversationRepository
            extends JpaRepository<Conversation, Long> {
    }

    private Long makeConversationId() {
        return numbersOfIds++;
    }

    public boolean validateUserInConversation(Long userId, Long conversationId){
        conversations.get(conversationId);
    }
}
