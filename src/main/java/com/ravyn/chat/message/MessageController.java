package com.ravyn.chat.message;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<List<MessageResponse>> getMessagesForConversation(@PathVariable Long conversationId){
        Optional<List<MessageResponse>> messages = messageService.getMessagesForConversation(conversationId);
        if(messages.isEmpty())
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(messages.get());
    }
}
