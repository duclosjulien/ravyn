package com.ravyn.chat.conversation;

import com.ravyn.chat.repository.ConversationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;

    public ConversationService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    public Conversation getOrCreateConversation(Long user1Id, Long user2Id) {
        Long participantAId = Math.min(user1Id, user2Id);
        Long participantBId = Math.max(user1Id, user2Id);

        Optional<Conversation> conversation = conversationRepository.findByUser1IdAndUser2Id(participantAId, participantBId);
        if(conversation.isEmpty())
            return createConversation(participantAId, participantBId);

        return conversation.get();
    }

    private Conversation createConversation(Long participantAId, Long participantBId){
        return conversationRepository.save(new Conversation(participantAId, participantBId));
    }

    public boolean validateUserInConversation(Long userId, Long conversationId){
      Optional<Conversation> conversation = conversationRepository.findById(conversationId);
      if(conversation.isEmpty())
          return false;

      Conversation c = conversation.get();
      return Objects.equals(c.getUser1Id(), userId) || Objects.equals(c.getUser2Id(), userId);
    }

    public List<Conversation> getConversationsByUserId(Long userId){
        return conversationRepository.findByUser1IdOrUser2Id(userId, userId);

    }
}
