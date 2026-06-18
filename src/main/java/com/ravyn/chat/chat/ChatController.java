package com.ravyn.chat.chat;

import com.ravyn.chat.conversation.ConversationService;
import com.ravyn.chat.message.Message;
import com.ravyn.chat.message.MessageRequest;
import com.ravyn.chat.message.MessageResponse;
import com.ravyn.chat.repository.UserRepository;
import com.ravyn.chat.user.ChatUser;
import com.ravyn.chat.message.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.util.Optional;

@Controller
public class ChatController {
    private final SimpMessageSendingOperations messageTemplate;
    private final ConversationService conversationService;
    private final MessageService messageService;

    public ChatController(SimpMessageSendingOperations messageTemplate, ConversationService conversationService, MessageService messageService) {
        this.messageTemplate = messageTemplate;
        this.conversationService = conversationService;
        this.messageService = messageService;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload MessageRequest chatMessage){
        if (!conversationService.validateUserInConversation(chatMessage.getSenderId(), chatMessage.getConversationId()))
            return;

        Long conversationId = chatMessage.getConversationId();
        Long senderId = chatMessage.getSenderId();
        String content = chatMessage.getContent();

        MessageResponse messageResponse = messageService.saveMessage(conversationId, senderId, content);
        messageTemplate.convertAndSend("/topic/conversations/" + conversationId, messageResponse);
    }

    @MessageMapping("/chat.addUser")
    public void connectUser(@Payload Message message, SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("userId", message.getSenderId());
    }
}
