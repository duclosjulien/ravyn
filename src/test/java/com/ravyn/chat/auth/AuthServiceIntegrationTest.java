package com.ravyn.chat.auth;

import com.ravyn.chat.repository.UserRepository;
import com.ravyn.chat.user.ChatUser;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
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

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

    @Test
    void registrationRejectsNullPassword() {
        assertThrows(
                ConstraintViolationException.class,
                () -> authService.register("username", null, false)
        );
    }

    @Test
    void loginRotatesSessionId() throws Exception {
        String passwordHash = passwordEncoder.encode("testPassword");
        ChatUser testUser = new ChatUser("testUser", passwordHash);
        userRepository.save(testUser);

        MockHttpSession session = new MockHttpSession();
        String sessionId = session.getId();

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                .content("""
        {
          "username": "testUser",
          "password": "testPassword"
        }
        """)
                .session(session))
                .andExpect(status().isOk());

        String newSessionId = session.getId();
        assertNotEquals(sessionId, newSessionId);
    }
}
