package com.ravyn.chat.auth;

import com.ravyn.chat.repository.UserRepository;
import com.ravyn.chat.user.ChatUser;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Testcontainers
class AuthServiceIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void registrationNormalizesUsernameAndInitializesDisplayName() {
        authService.register("  username  ", "password123", false);

        ChatUser user = userRepository.findByUsername("username")
                .orElseThrow();

        assertEquals("username", user.getUsername());
        assertEquals("username", user.getDisplayName());
    }

    @Test
    void registrationRejectsUsernameThatIsTooShortAfterTrimming () {
        assertThrows(
                ConstraintViolationException.class,
                () -> authService.register(" a ", "password123", false)
        );
    }
}
