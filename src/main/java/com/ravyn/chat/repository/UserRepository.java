package com.ravyn.chat.repository;

import com.ravyn.chat.user.ChatUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.StringJoiner;


public interface UserRepository extends JpaRepository<ChatUser, Long> {
    Optional<ChatUser> findByUsername(String username);
}