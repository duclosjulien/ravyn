package com.ravyn.chat.user;

import com.ravyn.chat.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
class UserPersistenceIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private UserRepository userRepository;

    @Test
    void newUserDefaultsDisplayNameToUsername() {
        ChatUser savedUser =
                userRepository.saveAndFlush(new ChatUser("valid", "hash"));

        ChatUser persistedUser =
                userRepository.findById(savedUser.getId()).orElseThrow();

        assertEquals("valid", persistedUser.getUsername());
        assertEquals("valid", persistedUser.getDisplayName());
    }

    @ParameterizedTest
    @NullSource
    @ValueSource(strings = {"", " ", "a"})
    void invalidDisplayNameIsRejected(String displayName) {
        ChatUser user = new ChatUser("username", "hash");
        user.setDisplayName(displayName);

        assertThrows(
                DataIntegrityViolationException.class,
                () -> userRepository.saveAndFlush(user)
        );
    }

    @Test
    void displayNameTooLongIsRejected() {
        ChatUser user = new ChatUser("username", "hash");
        user.setDisplayName("a".repeat(51));

        assertThrows(
                DataIntegrityViolationException.class,
                () -> userRepository.saveAndFlush(user)
        );
    }
}
