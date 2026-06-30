package com.ravyn.chat.conversation;

import com.ravyn.chat.exception.*;
import com.ravyn.chat.message.Message;
import com.ravyn.chat.message.MessageService;
import com.ravyn.chat.repository.ConversationRepository;
import com.ravyn.chat.user.ChatUser;
import com.ravyn.chat.user.UserService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserService userService;
    private final MessageService messageService;

    public ConversationService(ConversationRepository conversationRepository, UserService userService, MessageService messageService) {
        this.conversationRepository = conversationRepository;
        this.userService = userService;
        this.messageService = messageService;
    }

    public Conversation getConversationOrThrow(Long conversationId) {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException(conversationId));
    }

    public ConversationResponse getOrCreateConversation(Long currentUserId, Long otherUserId) {
        if(Objects.equals(currentUserId, otherUserId))
            throw new SelfConversationException();

        userService.ensureUserExists(currentUserId);
        userService.ensureUserExists(otherUserId);

        Long participantAId = Math.min(currentUserId, otherUserId);
        Long participantBId = Math.max(currentUserId, otherUserId);

        Conversation conversation = conversationRepository.findByUser1IdAndUser2Id(participantAId, participantBId)
                .orElseGet(() -> createConversation(participantAId, participantBId));

        return new ConversationResponse(
                conversation.getId(),
                otherUserId,
                userService.findUserById(otherUserId).getUsername(),
                null,
                null,
                null);
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

    public Conversation getConversationForUserOrThrow(Long conversationId, Long userId){
        Conversation conversation = getConversationOrThrow(conversationId);

        if(!isParticipant(conversation, userId))
            throw new ConversationAccessDeniedException(conversationId);

        return conversation;
    }

    private List<ConversationResponse> toConversationResponses(Map<Long, String> usernameByUserId, List<Conversation> conversations, Long userId){
        List<ConversationResponse> conversationResponses = new ArrayList<>();

        for(Conversation conversation: conversations) {
            Long conversationId = conversation.getId();
            Long otherUserId = getOtherUserId(conversation, userId);
            String otherUsername = usernameByUserId.get(otherUserId);

            if (otherUsername == null)
                continue;

            Optional<Message> lastMessage = messageService.getLastMessageCreatedByConversationId(conversationId);

            conversationResponses.add(new ConversationResponse(
                    conversationId,
                    otherUserId,
                    otherUsername,
                    lastMessage.map(Message::getContent).orElse(null),
                    lastMessage.map(Message::getCreatedAt).orElse(null),
                    lastMessage.map(Message::getSenderId).orElse(null)));
        }

        return conversationResponses;
    }

    private Map<Long, String> buildUsernameMap(Set<Long> userIds){
        List<ChatUser> users = userService.findUsersByIds(userIds);

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

    public List<Long> getParticipantIds(Long conversationId){
        Conversation conversation = conversationRepository.findById(conversationId).
                orElseThrow(DataIntegrityException::new);
        List<Long> participantIds = new ArrayList<>();
        participantIds.add(conversation.getUser1Id());
        participantIds.add(conversation.getUser2Id());
        return participantIds;
    }
}
