package com.ravyn.chat.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "chat_user")
public class ChatUser {
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;
    @Column(nullable = false)
    private String passwordHash;

    public ChatUser(){}

    public ChatUser(String username, String passwordHash){
        this.username = username;
        this.passwordHash = passwordHash;
    }
}
