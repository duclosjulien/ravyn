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
    public CreateConversationResponse getConversationOrCreateConversation(@RequestBody ConversationRequest request) {
        Conversation conversation = conversationService.getOrCreateConversation(
                request.getUser1Id(),
                request.getUser2Id());

        return new CreateConversationResponse(conversation.getId());
    }

    @GetMapping("/me")
    public List<ConversationResponse> getCurrentUserConversations(Authentication authentication){
        if (authentication == null) {
            throw new AuthenticationRequiredException();
        }
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        return conversationService.getConversationsForUser(user.id());
    }

}
