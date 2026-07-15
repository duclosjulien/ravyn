package com.ravyn.chat.message;

import com.ravyn.chat.conversation.ConversationService;
import com.ravyn.chat.exception.ConversationAccessDeniedException;
import com.ravyn.chat.exception.EmptyMessageContentException;
import com.ravyn.chat.repository.MessageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MessageServiceTest {
    @Mock
    private MessageRepository messageRepository;

    @Mock
    private ConversationService conversationService;

    @InjectMocks
    private MessageService  messageService;

    @Test
    public void rejectEmptyMessage() {
        Long conversationId = 0L;
        Long userId = 0L;

        assertThrows(EmptyMessageContentException.class,
                () -> messageService.saveMessage(conversationId, userId, ""));

        verify(messageRepository, never()).save(any(Message.class));
        verifyNoInteractions(conversationService);
    }

    @Test
    public void rejectsMessageHistoryQueryIfUnauthorized() {
        Long conversationId = 0L;
        Long unauthorizedUserId = 666L;

        when(conversationService.getConversationForUserOrThrow(conversationId, unauthorizedUserId))
                .thenThrow(ConversationAccessDeniedException.class);

        assertThrows(ConversationAccessDeniedException.class,
                () -> messageService.getMessagesForConversation(conversationId, unauthorizedUserId));

        verifyNoInteractions(messageRepository);

    }
}
