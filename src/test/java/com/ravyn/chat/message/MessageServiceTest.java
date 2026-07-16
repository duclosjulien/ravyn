package com.ravyn.chat.message;

import com.ravyn.chat.conversation.Conversation;
import com.ravyn.chat.conversation.ConversationService;
import com.ravyn.chat.exception.ConversationAccessDeniedException;
import com.ravyn.chat.exception.EmptyMessageContentException;
import com.ravyn.chat.exception.MessageContentTooLongException;
import com.ravyn.chat.repository.MessageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.InOrder;
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
    public void saveMessageRejectsBlankContent() {
        Long conversationId = 0L;
        Long userId = 0L;
        String emptyString = "";

        assertThrows(EmptyMessageContentException.class,
                () -> messageService.saveMessage(conversationId, userId, emptyString));

        verify(messageRepository, never()).save(any(Message.class));
        verifyNoInteractions(conversationService);
    }

    @Test
    public void rejectsMessageContentExceedingLimit() {
        Long conversationId = 0L;
        Long userId = 0L;
        String tooLongContent = "a".repeat(2001);

        assertThrows(MessageContentTooLongException.class,
                () -> messageService.saveMessage(conversationId, userId, tooLongContent));

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

    @Test
    public void saveMessageValidatesConversationAccessBeforeSaving() {
        Long conversationId = 0L;
        Long authorizedUserId = 0L;
        Long otherUserId = 1L;
        String validString = "Valid string";
        Conversation conversation = new Conversation(authorizedUserId, otherUserId);

        when(conversationService.getConversationForUserOrThrow(conversationId, authorizedUserId))
                .thenReturn(conversation);
        when(messageRepository.save(any(Message.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        messageService.saveMessage(conversationId, authorizedUserId, validString);

        InOrder inOrder = inOrder(conversationService, messageRepository);
        inOrder.verify(conversationService).getConversationForUserOrThrow(conversationId, authorizedUserId);
        inOrder.verify(messageRepository).save(any(Message.class));
    }
}
