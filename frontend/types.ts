export interface IncomingChatMessage {
    senderId: number;
    conversationId: number;
    content: string;
}

export interface OutgoingChatMessage {
    senderId: number;
    senderUsername: string;
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
    otherUserId: number;
    otherUsername: string;
}

export interface UserSummary {
    id: number;
    username: string;
}

export interface MessageResponse{
    id: number;
    conversationId: number;
    senderId: number;
    senderUsername: string;
    content: string;
    createdAt: string;
}

export interface CreateConversationResponse {
    id: number;
}

type ErrorCode =
    | "CONVERSATION_NOT_FOUND"
    | "USER_NOT_FOUND"
    | "CONVERSATION_WITH_SELF"
    | "CORRUPTED_DATA"
    | "UNKNOWN_ERROR"
    | "INVALID_CREDENTIALS"
    | "USERNAME_TAKEN";

export interface ApiError {
    message: string;
    code: ErrorCode;
}