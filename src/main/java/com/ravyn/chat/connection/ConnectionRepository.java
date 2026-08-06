package com.ravyn.chat.connection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    List<Connection> findByRequestReceiverIdAndStatusOrderByCreatedAtDesc(
            Long userId,
            ConnectionStatus status
    );

    @Query("""

    SELECT c
    FROM Connection c
    WHERE
        (c.requestSenderId = :user1Id AND c.requestReceiverId = :user2Id)
        OR
        (c.requestSenderId = :user2Id AND c.requestReceiverId = :user1Id)
    """)
    Optional<Connection> findConnectionBetweenUserIds(
            @Param("user1Id") Long user1Id,
            @Param("user2Id") Long user2Id
    );
}
