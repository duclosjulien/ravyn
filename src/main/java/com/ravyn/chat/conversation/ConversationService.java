package com.ravyn.chat.conversation;

import com.ravyn.chat.exception.SelfConversationException;
import com.ravyn.chat.exception.UserNotFoundException;
import com.ravyn.chat.message.Message;
import com.ravyn.chat.repository.ConversationRepository;
import com.ravyn.chat.repository.MessageRepository;
import com.ravyn.chat.repository.UserRepository;
import com.ravyn.chat.user.ChatUser;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    public ConversationService(ConversationRepository conversationRepository, UserRepository userRepository, MessageRepository messageRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
    }

    public Conversation getOrCreateConversation(Long user1Id, Long user2Id) {
        if(Objects.equals(user1Id, user2Id))
            throw new SelfConversationException();

        if (!userRepository.existsById(user1Id))
            throw new UserNotFoundException(user1Id);
        if (!userRepository.existsById(user2Id))
            throw new UserNotFoundException(user2Id);

        Long participantAId = Math.min(user1Id, user2Id);
        Long participantBId = Math.max(user1Id, user2Id);

        return conversationRepository.findByUser1IdAndUser2Id(participantAId, participantBId)
                .orElseGet(() -> createConversation(participantAId, participantBId));
    }

    private Conversation createConversation(Long participantAId, Long participantBId){
        return conversationRepository.save(new Conversation(participantAId, participantBId));
    }

    public boolean validateUserInConversation(Long userId, Long conversationId){
        Optional<Conversation> conversation = conversationRepository.findById(conversationId);

        if(conversation.isEmpty())
              return false;

         return isParticipant(conversation.get(), userId);
    }

    private boolean isParticipant(Conversation conversation, Long userId){
        return Objects.equals(conversation.getUser1Id(), userId) || Objects.equals(conversation.getUser2Id(), userId);
    }

    public List<ConversationResponse> getConversationsForUser(Long userId){
        List<Conversation> conversations = getConversationsByUserId(userId);
        Set<Long> otherUserIds = collectOtherUserIds(conversations, userId);
        Map<Long, String> usernameByUserId = buildUsernameMap(otherUserIds);

        return toConversationResponses(usernameByUserId, conversations, userId);
    }

    private List<ConversationResponse> toConversationResponses(Map<Long, String> usernameByUserId, List<Conversation> conversations, Long userId){
        List<ConversationResponse> conversationResponses = new ArrayList<>();

        for(Conversation conversation: conversations) {
            Long conversationId = conversation.getId();
            Long otherUserId = getOtherUserId(conversation, userId);
            String otherUsername = usernameByUserId.get(otherUserId);

            if (otherUsername == null)
                continue;

            Optional<Message> lastMessage =
                    messageRepository.findFirstByConversationIdOrderByCreatedAtDesc(conversationId);

            conversationResponses.add(new ConversationResponse(conversationId,
                    otherUserId,
                    otherUsername,
                    lastMessage.map(Message::getContent).orElse(null),
                    lastMessage.map(Message::getCreatedAt).orElse(null)));
        }

        return conversationResponses;
    }

    private Map<Long, String> buildUsernameMap(Set<Long> userIds){
        Iterable<ChatUser> users = userRepository.findAllById(userIds);

        Map<Long, String> usernameByUserId = new HashMap<>();
        for(ChatUser user: users)
            usernameByUserId.put(user.getId(), user.getUsername());

        return usernameByUserId;
    }

    private Set<Long> collectOtherUserIds(List<Conversation> conversations, Long userId){
        Set<Long> otherUserIds = new HashSet<>();

        for(Conversation conversation: conversations)
            otherUserIds.add(getOtherUserId(conversation, userId));

        return otherUserIds;
    }

    private Long getOtherUserId(Conversation conversation, Long currUserId){
        return Objects.equals(conversation.getUser1Id(), currUserId) ?  conversation.getUser2Id() : conversation.getUser1Id();
    }

    private List<Conversation> getConversationsByUserId(Long userId){
        return conversationRepository.findByUser1IdOrUser2Id(userId, userId);
    }
}
