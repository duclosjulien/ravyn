import {User, Conversation, UserSummary, MessageResponse, ApiError, CreateConversationResponse} from './types';

export async function userLogin(username: string, password: string): Promise<User> {
    const response = await fetch("/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const apiError =  await parseApiError(response);
        throw new Error(apiError.message);
    }

    const user: User = await response.json();
    return user;
}

export async function registerUser(username: string, password: string): Promise<User> {
    const response = await fetch("/users/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const apiError =  await parseApiError(response);
        throw new Error(apiError.message);
    }

    const user: User = await response.json();
    return user;
}

export async function createConversation(user1Id: number, user2Id: number): Promise<number> {
    const response = await fetch("/conversations/create", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ user1Id, user2Id })
    });

    if (!response.ok) {
        const apiError =  await parseApiError(response);
        throw new Error(apiError.message);
    }
    const body: CreateConversationResponse = await response.json();
    return body.id;
}

export async function getConversationsByUserId(userId: number) : Promise<Conversation[]>{
    const response = await fetch(`/conversations/user/${userId}`, {
        method: "GET"
    });

    if (!response.ok) {
        const apiError =  await parseApiError(response);
        throw new Error(apiError.message);
    }

    const conversations: Conversation[] = await response.json();
    return conversations;
}

export async function findUserByUsername(username: string): Promise<UserSummary | null> {
    const response = await fetch(`/users/search?username=${encodeURIComponent(username)}`, {
        method: "GET"
    });

    if(response.status === 404) return null;

    if (!response.ok) {
        const apiError =  await parseApiError(response);
        throw new Error(apiError.message);
    }

    const userSummary: UserSummary = await response.json();
    return userSummary;
}

export async function getMessagesForConversation(conversationId: number): Promise<MessageResponse[]> {
    const response = await fetch(`/messages/conversation/${conversationId}`, {
        method: "GET"
    });

    if (!response.ok) {
        const apiError =  await parseApiError(response);
        throw new Error(apiError.message);
    }

    const messages: MessageResponse[] = await response.json();
    return messages;
}

async function parseApiError(response: Response): Promise<ApiError> {
    try {
        const body = await response.json();
        return {
            message: body?.message || "Unknown error",
            code: body?.code || "UNKNOWN_ERROR",
        };
    } catch {
        return { message: "Unknown error", code: "UNKNOWN_ERROR" };
    }
}

