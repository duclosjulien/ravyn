package com.ravyn.chat.conversation;

import com.ravyn.chat.exception.SelfConversationException;
import com.ravyn.chat.repository.ConversationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
