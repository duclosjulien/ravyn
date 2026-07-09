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
    private Long participantLowId;

    @Column(name = "participant_high_id", nullable = false)
    private Long participantHighId;

    protected Conversation() {}

    public Conversation(Long participantLowId, Long participantHighId) {
        this.participantLowId = participantLowId;
        this.participantHighId = participantHighId;
    }
}
