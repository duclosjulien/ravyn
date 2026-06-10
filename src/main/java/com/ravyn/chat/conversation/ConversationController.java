package com.ravyn.chat.conversation;

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

    @GetMapping("/user/{userId}")
    public List<ConversationResponse> getConversationsById(@PathVariable Long userId){
       return conversationService.getConversationsForUser(userId);
    }

}
