import type {
  ConnectionPreview,
  ConversationPreview,
  ProfilePreview
} from "../types/appShell";

export const mockConversations: ConversationPreview[] = [
  {
    id: "conversation-mara",
    displayName: "Mara Voss",
    initials: "MV",
    excerpt: "I'll bring something to read on the train.",
    timestamp: "2:14 PM"
  },
  {
    id: "conversation-theodore",
    displayName: "Theodore K.",
    initials: "TK",
    excerpt: "The manuscript is almost ready.",
    timestamp: "Yesterday"
  },
  {
    id: "conversation-lena",
    displayName: "Lena Harlow",
    initials: "LH",
    excerpt: "Dinner Thursday sounds lovely.",
    timestamp: "Monday"
  },
  {
    id: "conversation-sable",
    displayName: "Sable",
    initials: "S",
    excerpt: "Thinking about what you said.",
    timestamp: "Saturday"
  },
  {
    id: "conversation-nikolai",
    displayName: "Nikolai Petrov",
    initials: "NP",
    excerpt: "Safe travels. Write when you arrive.",
    timestamp: "Jun 10"
  }
];

export const mockConnections: ConnectionPreview[] = [
  {
    id: "connection-mara",
    displayName: "Mara Voss",
    initials: "MV",
    supportingText: "A quiet correspondent"
  },
  {
    id: "connection-theodore",
    displayName: "Theodore K.",
    initials: "TK",
    supportingText: "Connected recently"
  },
  {
    id: "connection-lena",
    displayName: "Lena Harlow",
    initials: "LH",
    supportingText: "Letters and long dinners"
  },
  {
    id: "connection-sable",
    displayName: "Sable",
    initials: "S",
    supportingText: "A trusted connection"
  }
];

export const mockProfile: ProfilePreview = {
  displayName: "Julien Duclos",
  username: "julien",
  initials: "JD"
};
