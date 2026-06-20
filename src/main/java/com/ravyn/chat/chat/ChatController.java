package com.ravyn.chat.chat;

import com.ravyn.chat.auth.AuthenticatedUser;
import com.ravyn.chat.conversation.ConversationService;
import com.ravyn.chat.message.Message;
import com.ravyn.chat.message.MessageRequest;
import com.ravyn.chat.message.MessageResponse;
import com.ravyn.chat.message.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.security.Principal;

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
    public void sendMessage(@Payload MessageRequest chatMessage, Principal principal){
        if (!(principal instanceof Authentication authentication))
            return;

        AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();
        Long conversationId = chatMessage.getConversationId();
        Long senderId = currentUser.id();

        if (!conversationService.validateUserInConversation(senderId, conversationId))
            return;

        MessageResponse messageResponse = messageService.saveMessage(
                conversationId,
                senderId,
                chatMessage.getContent());
        messageTemplate.convertAndSend("/topic/conversations/" + conversationId, messageResponse);
    }
}
