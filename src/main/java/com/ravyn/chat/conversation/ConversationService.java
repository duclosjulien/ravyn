package com.ravyn.chat.conversation;

import com.ravyn.chat.repository.ConversationRepository;
import com.ravyn.chat.repository.UserRepository;
import com.ravyn.chat.user.ChatUser;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    public ConversationService(ConversationRepository conversationRepository, UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
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

    public List<ConversationResponse> getConversationsForUser(Long userId){
        List<Conversation> conversations = getConversationsByUserId(userId);

        Set<Long> otherUserIds = new HashSet<>();
        for(Conversation conversation: conversations){
            Long otherUserId = Objects.equals(conversation.getUser1Id(), userId) ?  conversation.getUser2Id() : conversation.getUser1Id();
            otherUserIds.add(otherUserId);
        }

        Iterable<ChatUser> users = userRepository.findAllById(otherUserIds);
        Map<Long, String> usernameByUserId = new HashMap<>();
        for(ChatUser user: users)
            usernameByUserId.put(user.getId(), user.getUsername());

        List<ConversationResponse> conversationResponses = new ArrayList<>();
        for(Conversation conversation: conversations) {
            Long conversationId = conversation.getId();
            Long otherUserId = Objects.equals(conversation.getUser1Id(), userId) ? conversation.getUser2Id() : conversation.getUser1Id();
            String otherUsername = usernameByUserId.get(otherUserId);
            if (otherUsername == null)
                continue;
            conversationResponses.add(new ConversationResponse(conversationId, otherUserId, otherUsername));
        }
        return conversationResponses;
    }

    public List<Conversation> getConversationsByUserId(Long userId){
        return conversationRepository.findByUser1IdOrUser2Id(userId, userId);

    }
}
