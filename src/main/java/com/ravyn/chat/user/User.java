package com.ravyn.chat.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;

    private String username;

    public User(){}

    public User(String username){
        this.username = username;
    }
}
