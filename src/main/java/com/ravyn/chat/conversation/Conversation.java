package com.ravyn.chat.conversation;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(
        uniqueConstraints = @UniqueConstraint(
                name = "uk_conversation_participants",
                columnNames = {"participant_low_id", "participant_high_id"}
        )
)
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "participant_low_id", nullable = false)
    private Long user1Id;

    @Column(name = "participant_high_id", nullable = false)
    private Long user2Id;

    protected Conversation() {}

    public Conversation(Long user1Id, Long user2Id) {
        this.user1Id = user1Id;
        this.user2Id = user2Id;
    }
}
