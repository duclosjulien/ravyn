package com.ravyn.chat.message;

import com.ravyn.chat.auth.AuthenticatedUser;
import com.ravyn.chat.exception.AuthenticationRequiredException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/conversation/{conversationId}")
    public List<MessageResponse> getMessagesForConversation(@PathVariable Long conversationId, Authentication authentication){
        if (authentication == null)
            throw new AuthenticationRequiredException();

        AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();
        return messageService.getMessagesForConversation(conversationId, currentUser.id());
    }
}
