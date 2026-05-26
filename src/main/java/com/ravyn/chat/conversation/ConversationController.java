package com.ravyn.chat.conversation;

import com.ravyn.chat.repository.ConversationRepository;
import com.ravyn.chat.conversation.ConversationService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        return conversationService.getConversation(user1Id, user2Id);
    }


}
