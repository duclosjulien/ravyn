package com.ravyn.chat.message;

import com.ravyn.chat.conversation.Conversation;
import com.ravyn.chat.conversation.ConversationService;
import com.ravyn.chat.exception.DataIntegrityException;
import com.ravyn.chat.exception.EmptyMessageContentException;
import com.ravyn.chat.exception.MessageContentTooLongException;
import com.ravyn.chat.repository.MessageRepository;
import com.ravyn.chat.user.ChatUser;
import com.ravyn.chat.user.UserService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final ConversationService conversationService;
    private static final int MAX_MESSAGE_CONTENT_LENGTH = 2000;
    private final UserService userService;

    public MessageService(MessageRepository messageRepository, ConversationService conversationService, UserService userService) {
        this.messageRepository = messageRepository;
        this.conversationService = conversationService;
        this.userService = userService;
    }

    public MessageResponse saveMessage(Long conversationId, Long senderId, String messageContent){
        validateMessageContent(messageContent);

        Conversation conversation = conversationService.getConversationForUserOrThrow(conversationId, senderId);
        ChatUser sender = getUserOrThrow(senderId);
        Message message = messageRepository.save(new Message(conversation.getId(), senderId, messageContent));

        return new MessageResponse(
                message.getId(),
                message.getConversationId(),
                message.getSenderId(),
                sender.getUsername(),
                message.getContent(),
                message.getCreatedAt()
        );
    }

    private void validateMessageContent(String messageContent){
        if (messageContent == null || messageContent.isBlank()) {
            throw new EmptyMessageContentException();
        }
        if (messageContent.length() > MAX_MESSAGE_CONTENT_LENGTH) {
            throw new MessageContentTooLongException(MAX_MESSAGE_CONTENT_LENGTH);
        }
    }

    public List<MessageResponse> getMessagesForConversation(Long conversationId, Long currentUserId){
        Conversation conversation = conversationService.getConversationForUserOrThrow(conversationId, currentUserId);

        Map<Long, String> usernameByUserId = buildUsernameMap(conversation);
        List<Message> messageList = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId());

        return toMessageResponses(messageList, usernameByUserId);
    }

    private Map<Long, String> buildUsernameMap(Conversation conversation){
        Long user1Id = conversation.getParticipantLowId();
        Long user2Id = conversation.getParticipantHighId();

        ChatUser user1 = getUserOrThrow(user1Id);
        ChatUser user2 = getUserOrThrow(user2Id);

        Map<Long, String> usernameByUserId = new HashMap<>();

        usernameByUserId.put(user1Id, user1.getUsername());
        usernameByUserId.put(user2Id, user2.getUsername());

        return usernameByUserId;
    }

    private ChatUser getUserOrThrow(Long userId){
        Optional<ChatUser> user = userService.findUserEntityById(userId);

        if(user.isEmpty()) {
            throw new DataIntegrityException();
        }

        return user.get();
    }

    private List<MessageResponse> toMessageResponses(List<Message> messageList, Map<Long, String> usernameByUserId){
        List<MessageResponse> messageResponseList = new ArrayList<>();

        for(Message message : messageList) {
            messageResponseList.add(toMessageResponse(message, usernameByUserId));
        }
        return messageResponseList;
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
