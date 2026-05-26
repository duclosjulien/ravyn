package com.ravyn.chat.conversation;

import com.ravyn.chat.repository.ConversationRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/conversations")
public class ConversationController {
    private final ConversationRepository conversationRepository;

    public ConversationController(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    @PostMapping("/create")
    public Conversation getConversation(@RequestBody ConversationRequest request){
        Long user1Id = request.getUser1Id();
        Long user2Id = request.getUser2Id();
        Optional<Conversation> conversation = conversationRepository.findByUser1IdAndUser2Id(user1Id, user2Id);
        if(conversation.isEmpty())
            return createConversation(user1Id, user2Id);

        return conversation.get();
    }

    private Conversation createConversation(Long user1Id, Long user2Id){
        return conversationRepository.save(new Conversation(user1Id, user2Id));
    }

}
