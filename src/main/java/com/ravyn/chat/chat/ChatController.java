package com.ravyn.chat.chat;

import com.ravyn.chat.conversation.ConversationService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    private final SimpMessageSendingOperations messageTemplate;
    private final ConversationService conversationService;

    public ChatController(SimpMessageSendingOperations messageTemplate, ConversationService conversationService) {
        this.messageTemplate = messageTemplate;
        this.conversationService = conversationService;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage){
        if (!conversationService.validateUserInConversation(chatMessage.getSenderId(), chatMessage.getConversationId()))
            return;

        messageTemplate.convertAndSend("/topic/conversations/" + chatMessage.getConversationId(), chatMessage);
    }

    @MessageMapping("/chat.addUser")
    public void connectUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("userId", chatMessage.getSenderId());
    }
}
