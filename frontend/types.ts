export interface MessageRequest {
    conversationId: number;
    content: string;
}

export interface User {
    id: number;
    username: string;
}

export interface SelfProfileResponse {
    id: number;
    username: string;
    displayName: string;
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
    needsAttention: boolean;
}

export interface CreateConversationResponse {
    id: number;
}

export interface UserSearchResponse {
    user: UserSummary
    relationshipState: ConnectionRelationshipState
}

export interface UserSummary {
    id: number;
    username: string;
    displayName: string;
}

export interface ConnectionResponse {
    id: number;
    requestSenderId: number;
    requestReceiverId: number;
    status: ConnectionStatus;
    createdAt: string;
}

export type ConnectionRelationshipState =
    "NONE" |
    "OUTGOING_PENDING" |
    "INCOMING_PENDING" |
    "CONNECTED" |
    "REJECTED"
;

export interface IncomingConnectionRequestResponse {
    id: number;
    status: ConnectionStatus;
    createdAt: string;
    requestSenderSummary: UserSummary;
}

export type ConnectionStatus =
    "PENDING" | "ACCEPTED" | "REJECTED";

export interface ConnectionResolutionResponse {
    connectionId: number;
    status: ConnectionStatus;
}

export interface AcceptedConnectionResponse {
    connectionId: number;
    connectedUser: UserSummary;
}

export interface MessageResponse{
    id: number;
    conversationId: number;
    senderId: number;
    senderUsername: string;
    content: string;
    createdAt: string;
}


