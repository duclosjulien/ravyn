import { User, Conversation } from './types';

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
    const response = await fetch("conversations/create", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username: username })
    }
}