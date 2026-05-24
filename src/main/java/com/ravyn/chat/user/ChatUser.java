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

    public ChatUser(){}

    public ChatUser(String username){
        this.username = username;
    }
}
