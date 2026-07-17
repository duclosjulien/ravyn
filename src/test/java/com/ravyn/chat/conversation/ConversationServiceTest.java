package com.ravyn.chat.conversation;

import com.ravyn.chat.exception.SelfConversationException;
import com.ravyn.chat.repository.ConversationReadStateRepository;
import com.ravyn.chat.repository.ConversationRepository;
import com.ravyn.chat.repository.MessageRepository;
import com.ravyn.chat.user.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ConversationServiceTest {
    @Mock
    private ConversationRepository conversationRepository;

    @InjectMocks
    private ConversationService conversationService;

    @Test
    public void rejectCreateConversationWithSelf() {
        Long currentUserId = 0L;
        Long otherUserId = currentUserId;

        assertThrows(
                SelfConversationException.class,
                () -> conversationService.getOrCreateConversation(currentUserId, otherUserId)
        );
        verifyNoInteractions(conversationRepository);
    }
}
