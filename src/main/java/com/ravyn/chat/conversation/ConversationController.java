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
    public Conversation getConversation(@RequestBody ConversationRequest request){
        Long user1Id = request.getUser1Id();
        Long user2Id = request.getUser2Id();
        return conversationService.getOrCreateConversation(user1Id, user2Id);
    }

    @GetMapping("/user/{userId}")
    public List<ConversationResponse> getConversationsById(@PathVariable Long userId){
       return conversationService.getConversationsForUser(userId);
    }

}
