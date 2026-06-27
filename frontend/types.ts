export interface MessageRequest {
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
    lastMessageContent: string | null;
    lastMessageCreatedAt: string | null;
    lastMessageSenderId: number | null;
}

export interface CreateConversationResponse {
    id: number;
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