package com.ravyn.chat.conversation;

import com.ravyn.chat.auth.AuthenticatedUser;
import com.ravyn.chat.exception.AuthenticationRequiredException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conversations")
public class ConversationController {
    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @PostMapping("/create")
    public ConversationResponse createOrGetConversation(@RequestBody CreateConversationRequest request, Authentication authentication) {
        if (authentication == null)
            throw new AuthenticationRequiredException();

        AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();

        return conversationService.getOrCreateConversation(
                currentUser.id(),
                request.getRecipientUserId());
    }

    @GetMapping("/me")
    public List<ConversationResponse> getCurrentUserConversations(Authentication authentication){
        if (authentication == null)
            throw new AuthenticationRequiredException();

        AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();
        return conversationService.getConversationsForUser(currentUser.id());
    }

    @PostMapping("/{conversationId}/read")
    public void markConversationAsRead(@PathVariable Long conversationId, Authentication authentication){
        if (authentication == null)
            throw new AuthenticationRequiredException();

        AuthenticatedUser currentUser = (AuthenticatedUser) authentication.getPrincipal();
        conversationService.markConversationAsRead(conversationId, currentUser.id());

    }
}
