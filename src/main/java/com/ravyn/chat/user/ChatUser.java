package com.ravyn.chat.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class ChatUser {
    @Id
    @GeneratedValue
    private Long id;

    private String username;
    private String passwordHash;

    public ChatUser(){}

    public ChatUser(String username, String passwordHash){
        this.username = username;
        this.passwordHash = passwordHash;
    }
}
