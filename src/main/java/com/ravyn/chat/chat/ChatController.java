package com.ravyn.chat.chat;

import com.ravyn.chat.conversation.ConversationService;
import com.ravyn.chat.repository.UserRepository;
import com.ravyn.chat.user.ChatUser;
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
    private final UserRepository userRepository;

    public ChatController(SimpMessageSendingOperations messageTemplate, ConversationService conversationService, UserRepository userRepository) {
        this.messageTemplate = messageTemplate;
        this.conversationService = conversationService;
        this.userRepository = userRepository;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload IncomingChatMessage chatMessage){
        if (!conversationService.validateUserInConversation(chatMessage.getSenderId(), chatMessage.getConversationId()))
            return;
        Optional<ChatUser> user = userRepository.findById(chatMessage.getSenderId());
        if(user.isEmpty()) return;
        ChatUser sender = user.get();
        OutgoingChatMessage outgoingChatMessage = new OutgoingChatMessage(chatMessage.getConversationId(), chatMessage.getSenderId(), sender.getUsername(), chatMessage.getContent());
        messageTemplate.convertAndSend("/topic/conversations/" + chatMessage.getConversationId(), outgoingChatMessage);
    }

    @MessageMapping("/chat.addUser")
    public void connectUser(@Payload IncomingChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("userId", chatMessage.getSenderId());
    }
}
