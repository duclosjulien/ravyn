package com.ravyn.chat.chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    private final SimpMessageSendingOperations messageTemplate;

    public ChatController(SimpMessageSendingOperations messageTemplate) {
        this.messageTemplate = messageTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage){
       messageTemplate.convertAndSend("topic/conversations/" + chatMessage.getConversationId(), chatMessage);
    }

    @MessageMapping("/chat.addUser")
    public void connectUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("userId", chatMessage.getSenderId());
    }
}
