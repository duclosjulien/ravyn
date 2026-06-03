package com.ravyn.chat.conversation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/conversations")
public class ConversationController {
    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }


    @PostMapping("/create")
    public ResponseEntity<?> getConversation(@RequestBody ConversationRequest request) {
        Long user1Id = request.getUser1Id();
        Long user2Id = request.getUser2Id();

        try {
            Conversation conversation = conversationService.getOrCreateConversation(user1Id, user2Id);
            return ResponseEntity.ok(conversation);
        }
        catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public List<ConversationResponse> getConversationsById(@PathVariable Long userId){
       return conversationService.getConversationsForUser(userId);
    }

}
