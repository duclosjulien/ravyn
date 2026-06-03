package com.ravyn.chat.message;

import com.ravyn.chat.conversation.Conversation;
import com.ravyn.chat.repository.ConversationRepository;
import com.ravyn.chat.repository.MessageRepository;
import com.ravyn.chat.repository.UserRepository;
import com.ravyn.chat.user.ChatUser;
import org.springframework.stereotype.Service;

import java.time.Instant;
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
        Message message = new Message(conversationId, senderId, messageContent);
        return messageRepository.save(message);
    }

    public Optional<List<MessageResponse>> getMessagesForConversation(Long conversationId){
        Optional<Conversation> conversation = conversationRepository.findById(conversationId);
        if(conversation.isEmpty())
            return Optional.empty();
        Conversation conversationFound = conversation.get();

        Long user1Id = conversationFound.getUser1Id();
        Long user2Id = conversationFound.getUser2Id();
        Optional<ChatUser> user1 = userRepository.findById(user1Id);
        Optional<ChatUser> user2 = userRepository.findById(user2Id);
        if(user1.isEmpty() || user2.isEmpty())
            throw new IllegalStateException("Conversation references missing user");

        String user1Username = user1.get().getUsername();
        String user2Username = user2.get().getUsername();
        Map<Long, String> usernameByUserId = new HashMap<>();
        usernameByUserId.put(user1Id, user1Username);
        usernameByUserId.put(user2Id, user2Username);

        List<Message> messageList = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        List<MessageResponse> messageResponseList = new ArrayList<>();

        for(Message message: messageList)
            messageResponseList.add(toMessageResponse(message, usernameByUserId));

        return Optional.of(messageResponseList);
    }

    private MessageResponse toMessageResponse(Message message, Map<Long, String> usernameByUserId){
        Long id = message.getId();
        Long conversationId = message.getConversationId();
        Long senderId = message.getSenderId();
        String senderUsername = usernameByUserId.get(senderId);
        String content = message.getContent();
        Instant createdAt = message.getCreatedAt();

        return new MessageResponse(id, conversationId, senderId, senderUsername, content, createdAt);
    }
}
