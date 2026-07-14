package com.ravyn.chat.conversation;

import com.ravyn.chat.exception.SelfConversationException;
import com.ravyn.chat.repository.ConversationRepository;
import com.ravyn.chat.repository.UserRepository;
import com.ravyn.chat.user.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
public class ConversationServiceTest {
    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ConversationService conversationService;
    @InjectMocks
    private UserService userService;

    @Test
    public void testCreateConversationWithSelf() {
        Long currentUserId = 0L;
        Long otherUserId = currentUserId;

        assertThrows(
                SelfConversationException.class,
                () -> conversationService.getOrCreateConversation(currentUserId, otherUserId)
        );
        verifyNoInteractions(conversationRepository);
    }

}
