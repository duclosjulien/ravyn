package com.ravyn.chat.chat;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ConversationService {
    private final Map<String, Conversation> conversations = new HashMap<>();

    public Conversation getOrCreateConversation(String user1, String user2) {
        String id = makeConversationId(user1, user2);

        if (!conversations.containsKey(id))
            conversations.put(id, new Conversation(id, user1, user2));

        return conversations.get(id);
    }

    private String makeConversationId(String user1, String user2) {
        if (user1.compareTo(user2) < 0) {
            return user1 + "_" + user2;
        }
        return user2 + "_" + user1;
    }
}
