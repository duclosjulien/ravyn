package com.ravyn.chat.connection;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.Instant;

@Getter
@Entity
@Table(name = "connection")
public class Connection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_sender_id", nullable = false, updatable = false)
    private Long requestSenderId;

    @Column(name = "request_receiver_id", nullable = false, updatable = false)
    private Long requestReceiverId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConnectionStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    protected Connection() {}

    public Connection(Long requestSenderId, Long requestReceiverId) {
        this.requestSenderId = requestSenderId;
        this.requestReceiverId = requestReceiverId;
        this.status = ConnectionStatus.PENDING;
        this.createdAt = Instant.now();
    }

    public void accept() {
        ensurePending();
        this.status = ConnectionStatus.ACCEPTED;
        this.resolvedAt = Instant.now();
    }

    public void reject() {
        ensurePending();
        this.status = ConnectionStatus.REJECTED;
        this.resolvedAt = Instant.now();
    }

    private void ensurePending() {
        if (status != ConnectionStatus.PENDING) {
            throw new IllegalStateException("Only pending connections can be resolved");
        }
    }
}
