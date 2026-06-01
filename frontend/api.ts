import { User, Conversation, UserSummary } from './types';

export async function userLogin(username: string): Promise<User> {
    const response = await fetch("/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username: username })
    });
    const user = await response.json();
    return user as User;
}

export async function createConversation(user1Id: number, user2Id: number): Promise<Conversation> {
    const response = await fetch("/conversations/create", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ user1Id: user1Id, user2Id: user2Id })
    });
    const conversation = await response.json();
    return conversation as Conversation;
}

export async function getConversationsByUserId(userId: number) : Promise<Conversation[]>{
    const response = await fetch(`/conversations/user/${userId}`, {
        method: "GET"
    });
    const conversations = await response.json();
    return conversations as Conversation[];
}

export async function findUserByUsername(username: string): Promise<UserSummary | null> {
    const response = await fetch(`/users/search?username=${encodeURIComponent(username)}`, {
        method: "GET"
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to search user");

    const userSummary = await response.json();
    return userSummary as UserSummary;
}
