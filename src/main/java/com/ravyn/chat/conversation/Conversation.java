package com.ravyn.chat.conversation;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;

@Getter
@Entity
public class Conversation {

    @Id
    @GeneratedValue
    private Long id;

    private Long user1Id;
    private Long user2Id;

    protected Conversation() {}

    public Conversation(Long user1Id, Long user2Id) {
        this.user1Id = user1Id;
        this.user2Id = user2Id;
    }
}
