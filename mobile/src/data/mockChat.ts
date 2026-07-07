import { ConversationPreview, Message } from "@/types/chat";

export const mockConversations: ConversationPreview[] = [
  {
    id: "conversation-1",
    otherUserId: "user-camille",
    otherUsername: "Camille",
    lastMessageContent: "I saved the quiet line you sent earlier.",
    lastMessageCreatedAt: "2026-07-03T18:42:00Z"
  },
  {
    id: "conversation-2",
    otherUserId: "user-mara",
    otherUsername: "Mara",
    lastMessageContent: "Tea first, then the long walk.",
    lastMessageCreatedAt: "2026-07-03T15:10:00Z"
  },
  {
    id: "conversation-3",
    otherUserId: "user-elias",
    otherUsername: "Elias",
    lastMessageContent: "The garden gate is open.",
    lastMessageCreatedAt: "2026-07-02T21:18:00Z"
  }
];

export const mockMessages: Record<string, Message[]> = {
  "conversation-1": [
    {
      id: "message-1",
      conversationId: "conversation-1",
      senderId: "user-camille",
      senderUsername: "Camille",
      content: "I saved the quiet line you sent earlier.",
      createdAtLabel: "6:42 PM"
    },
    {
      id: "message-2",
      conversationId: "conversation-1",
      senderId: "user-julien",
      senderUsername: "Julien",
      content: "Keep it somewhere soft. I may need it again.",
      createdAtLabel: "6:44 PM"
    },
    {
      id: "message-3",
      conversationId: "conversation-1",
      senderId: "user-camille",
      senderUsername: "Camille",
      content: "Already tucked beside the window.",
      createdAtLabel: "6:46 PM"
    }
  ],
  "conversation-2": [
    {
      id: "message-4",
      conversationId: "conversation-2",
      senderId: "user-mara",
      senderUsername: "Mara",
      content: "Tea first, then the long walk.",
      createdAtLabel: "3:10 PM"
    }
  ],
  "conversation-3": [
    {
      id: "message-5",
      conversationId: "conversation-3",
      senderId: "user-elias",
      senderUsername: "Elias",
      content: "The garden gate is open.",
      createdAtLabel: "Yesterday"
    }
  ]
};
