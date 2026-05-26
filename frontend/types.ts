export interface ChatMessage {
    senderId: number;
    conversationId: number;
    content: string;
}

export interface User {
    id: number;
    username: string;
}

export interface StompPayload {
    body: string;
}

export interface Conversation {
    id: number;
    user1Id: number;
    user2Id: number;
}