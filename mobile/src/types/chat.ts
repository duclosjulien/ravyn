export interface ConversationPreview {
  id: string;
  otherUserId: string;
  otherUsername: string;
  lastMessageContent: string;
  lastMessageCreatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  createdAtLabel: string;
}
