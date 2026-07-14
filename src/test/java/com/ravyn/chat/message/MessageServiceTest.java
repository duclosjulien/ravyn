package com.ravyn.chat.message;

import com.ravyn.chat.exception.EmptyMessageContentException;
import com.ravyn.chat.repository.MessageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
public class MessageServiceTest {
    @Mock
    private MessageRepository messageRepository;

    @InjectMocks
    private MessageService  messageService;

    @Test
    public void rejectEmptyMessage() {
        Long conversationId = 0L;
        Long userId = 0L;

        assertThrows(EmptyMessageContentException.class,
                () -> messageService.saveMessage(conversationId, userId, ""));

        verifyNoInteractions(messageRepository);

    }
}
