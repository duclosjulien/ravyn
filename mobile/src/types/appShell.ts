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
