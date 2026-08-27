export interface ConversationPreview {
  id: string;
  displayName: string;
  initials: string;
  excerpt: string;
  timestamp: string;
}

export interface ConnectionPreview {
  id: string;
  displayName: string;
  initials: string;
  supportingText: string;
}

export interface ProfilePreview {
  displayName: string;
  username: string;
  initials: string;
}

export interface MessagePreview {
  id: string;
  direction: "incoming" | "outgoing";
  content: string;
  timestamp: string;
}

export interface ConversationDetail {
  conversationId: string;
  dateLabel: string;
  messages: MessagePreview[];
}
