import type {
  ConnectionPreview,
  ConversationDetail,
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

export const mockConversationDetails: Record<string, ConversationDetail> = {
  "conversation-mara": {
    conversationId: "conversation-mara",
    dateLabel: "TODAY",
    messages: [
      {
        id: "mara-message-1",
        direction: "incoming",
        content: "I found the collection of letters you mentioned.",
        timestamp: "2:08 PM"
      },
      {
        id: "mara-message-2",
        direction: "outgoing",
        content: "Keep it for the train. It deserves an unhurried afternoon.",
        timestamp: "2:11 PM"
      },
      {
        id: "mara-message-3",
        direction: "incoming",
        content: "I'll bring something to read on the train.",
        timestamp: "2:14 PM"
      }
    ]
  },
  "conversation-theodore": {
    conversationId: "conversation-theodore",
    dateLabel: "YESTERDAY",
    messages: [
      {
        id: "theodore-message-1",
        direction: "outgoing",
        content: "How is the final chapter settling?",
        timestamp: "6:32 PM"
      },
      {
        id: "theodore-message-2",
        direction: "incoming",
        content: "Slowly, but the manuscript is almost ready.",
        timestamp: "6:45 PM"
      }
    ]
  },
  "conversation-lena": {
    conversationId: "conversation-lena",
    dateLabel: "MONDAY",
    messages: [
      {
        id: "lena-message-1",
        direction: "incoming",
        content: "Would Thursday still suit you?",
        timestamp: "10:16 AM"
      },
      {
        id: "lena-message-2",
        direction: "outgoing",
        content: "Perfectly. Dinner Thursday sounds lovely.",
        timestamp: "10:20 AM"
      }
    ]
  },
  "conversation-sable": {
    conversationId: "conversation-sable",
    dateLabel: "SATURDAY",
    messages: [
      {
        id: "sable-message-1",
        direction: "outgoing",
        content: "No need to answer quickly. I only wanted you to know.",
        timestamp: "4:03 PM"
      },
      {
        id: "sable-message-2",
        direction: "incoming",
        content: "Thinking about what you said.",
        timestamp: "4:28 PM"
      }
    ]
  },
  "conversation-nikolai": {
    conversationId: "conversation-nikolai",
    dateLabel: "JUNE 10",
    messages: [
      {
        id: "nikolai-message-1",
        direction: "outgoing",
        content: "The road should be clear by morning.",
        timestamp: "8:41 PM"
      },
      {
        id: "nikolai-message-2",
        direction: "incoming",
        content: "Safe travels. Write when you arrive.",
        timestamp: "8:47 PM"
      }
    ]
  }
};
