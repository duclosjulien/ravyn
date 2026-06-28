package com.ravyn.chat.conversation;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"user1Id", "user2Id"})
)
public class Conversation {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private Long user1Id;
    @Column(nullable = false)
    private Long user2Id;

    protected Conversation() {}

    public Conversation(Long user1Id, Long user2Id) {
        this.user1Id = user1Id;
        this.user2Id = user2Id;
    }
}
