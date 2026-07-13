import {User, Conversation, UserSummary, MessageResponse, CreateConversationResponse} from './types.js';
import {ApiError} from "./errors.js";

export async function userLogin(username: string, password: string): Promise<User> {
    const response = await fetch("/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    });

    await throwIfApiError(response);

    const user: User = await response.json();
    return user;
}

export async function userLogout() {
    const response = await fetch("/auth/logout", {
        method: "POST"
    })

   await throwIfApiError(response);
}

export async function registerUser(username: string, password: string): Promise<User> {
    const response = await fetch("/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    });

    await throwIfApiError(response);

    const user: User = await response.json();
    return user;
}

export async function createConversation(recipientUserId: number): Promise<number> {
    const response = await fetch("/conversations/create", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ recipientUserId })
    });

    await throwIfApiError(response);

    const body: CreateConversationResponse = await response.json();
    return body.id;
}

export async function getCurrentUserConversations() : Promise<Conversation[]>{
    const response = await fetch("/conversations/me", {
        method: "GET"
    });

    await throwIfApiError(response);

    const conversations: Conversation[] = await response.json();
    return conversations;
}

export async function findUserByUsername(username: string): Promise<UserSummary | null> {
    const response = await fetch(`/users/search?username=${encodeURIComponent(username)}`, {
        method: "GET"
    });

    if(response.status === 404) return null;

    await throwIfApiError(response);

    const userSummary: UserSummary = await response.json();
    return userSummary;
}

export async function getMessagesForConversation(conversationId: number): Promise<MessageResponse[]> {
    const response = await fetch(`/messages/conversation/${conversationId}`, {
        method: "GET"
    });

    await throwIfApiError(response);

    const messages: MessageResponse[] = await response.json();
    return messages;
}

async function throwIfApiError(response: Response){
    if (response.ok) return;

    const apiError:ApiError =  await parseApiError(response);
    throw apiError;
}

async function parseApiError(response: Response): Promise<ApiError> {
    try {
        const body = await response.json();
        return new ApiError(
            response.status || 0,
            body?.errorCode || "UNKNOWN_ERROR",
            body?.message || "Unknown error",
        );
    } catch {
        return new ApiError(
            response.status,
            "UNKNOWN_ERROR",
            "Unknown error",
        );
    }
}

export async function getCurrentUser(): Promise<User> {
    const response = await fetch("/auth/me", {
        method: "GET"
    });

    await throwIfApiError(response);

    const currentUser: User = await response.json();
    return currentUser;
}

export async function markConversationAsRead(conversationId: number) : Promise<void> {
    const response = await fetch(`/conversations/${conversationId}/read`, {
        method: "POST"
    });

    await throwIfApiError(response);
}
