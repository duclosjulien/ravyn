package com.ravyn.chat.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "chat_user")
public class ChatUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String username;

    @Column(name ="display_name", nullable = false, length = 50)
    private String displayName;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    public ChatUser(){}

    public ChatUser(String username, String passwordHash){
        this.username = username;
        this.passwordHash = passwordHash;
        this.displayName = username;
    }
}

