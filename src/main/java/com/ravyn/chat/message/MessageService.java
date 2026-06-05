package com.ravyn.chat.message;

import com.ravyn.chat.conversation.Conversation;
import com.ravyn.chat.repository.ConversationRepository;
import com.ravyn.chat.repository.MessageRepository;
import com.ravyn.chat.repository.UserRepository;
import com.ravyn.chat.user.ChatUser;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;


    public MessageService(MessageRepository messageRepository, ConversationRepository conversationRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    public Message saveMessage(Long conversationId, Long senderId, String messageContent){
        if (messageContent == null || messageContent.isBlank())
            throw new IllegalArgumentException("Message content cannot be blank");

        Message message = new Message(conversationId, senderId, messageContent);
        return messageRepository.save(message);
    }

    private List<MessageResponse> getMessagesForConversation(Long conversationId){
        Conversation conversation = getConversationOrThrow(conversationId);

        Map<Long, String> usernameByUserId = buildUsernameMap(conversation);
        List<Message> messageList = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);

        return toMessageResponses(messageList, usernameByUserId);
    }

    private Map<Long, String> buildUsernameMap(Conversation conversation){
        Long user1Id = conversation.getUser1Id();
        Long user2Id = conversation.getUser2Id();

        ChatUser user1 = getUserOrThrow(user1Id);
        ChatUser user2 = getUserOrThrow(user2Id);

        Map<Long, String> usernameByUserId = new HashMap<>();

        usernameByUserId.put(user1Id, user1.getUsername());
        usernameByUserId.put(user2Id, user2.getUsername());

        return usernameByUserId;
    }

    private ChatUser getUserOrThrow(Long userId){
        Optional<ChatUser> user = userRepository.findById(userId);

        if(user.isEmpty())
            throw new IllegalStateException("Conversation references missing user");

        return user.get();
    }

    private List<MessageResponse> toMessageResponses(List<Message> messageList, Map<Long, String> usernameByUserId){
        List<MessageResponse> messageResponseList = new ArrayList<>();

        for(Message message: messageList)
            messageResponseList.add(toMessageResponse(message, usernameByUserId));

        return messageResponseList;
    }

    private Conversation getConversationOrThrow(Long conversationId){
        Optional<Conversation> conversation = conversationRepository.findById(conversationId);

        if(conversation.isEmpty())
            throw new IllegalArgumentException("Conversation not found");

        return conversation.get();
    }

    private MessageResponse toMessageResponse(Message message, Map<Long, String> usernameByUserId) {
        return new MessageResponse(
                message.getId(),
                message.getConversationId(),
                message.getSenderId(),
                usernameByUserId.get(message.getSenderId()),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}
