export async function userLogin(username) {
    const response = await fetch("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username })
    });
    const user = await response.json();
    return user;
}
export async function createConversation(user1Id, user2Id) {
    const response = await fetch("/conversations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user1Id: user1Id, user2Id: user2Id })
    });
    const conversation = await response.json();
    return conversation;
}
export async function getConversationsByUserId(userId) {
    const response = await fetch(`/conversations/user/${userId}`, {
        method: "GET"
    });
    const conversations = await response.json();
    return conversations;
}
export async function findUserByUsername(username) {
    const response = await fetch(`/users/search?username=${username}`, {
        method: "GET"
    });
    const userSummary = await response.json();
    return userSummary;
}
//# sourceMappingURL=api.js.map