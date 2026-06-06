package com.ravyn.chat.message;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<?>  getMessagesForConversation(@PathVariable Long conversationId){
        try {
            return ResponseEntity.ok(messageService.getMessagesForConversation(conversationId));
        } catch(IllegalArgumentException exception){
            return ResponseEntity.status(404).body(exception.getMessage());
        }
    }
}
