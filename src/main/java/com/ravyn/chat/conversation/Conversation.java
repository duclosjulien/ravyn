package com.ravyn.chat.conversation;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Conversation {
    @Id
    @GeneratedValue
    private Long id;

    private Long user1Id;
    private Long user2Id;

    public Conversation() {}
}
