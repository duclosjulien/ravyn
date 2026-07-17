package com.ravyn.chat.conversation;

import com.ravyn.chat.repository.ConversationRepository;
import com.ravyn.chat.repository.UserRepository;
import com.ravyn.chat.user.ChatUser;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@Testcontainers
public class ConversationServiceIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private ConversationService conversationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Test
    public void doesNotCreateDuplicateConversationForSameUsers() {
        ChatUser userA = userRepository.save(new ChatUser("julien", "password"));
        ChatUser userB = userRepository.save(new ChatUser("gab", "password"));

        ConversationResponse conversationA = conversationService.getOrCreateConversation(userA.getId(), userB.getId());
        ConversationResponse conversationB = conversationService.getOrCreateConversation(userB.getId(), userA.getId());

        assertEquals(conversationA.getId(), conversationB.getId());
        assertEquals(1, conversationRepository.count());
    }
}
