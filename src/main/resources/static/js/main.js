'use strict';
import { createConversation, getConversationsByUserId, userLogin } from './api.js';
let stompClient = null;
let currentUser = null;
let currentConversationId = null;
let conversations = [];
let currentSubscription = null;
const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const messageArea = document.querySelector('#messageArea');
const connectingElement = document.querySelector('.connecting');
const recipientIdInput = document.querySelector('#recipientId');
const conversationList = document.querySelector('#conversationList');
const startConversationButton = document.querySelector('#startConversationButton');
async function connect(event) {
    event.preventDefault();
    const username = document.querySelector('#name').value.trim();
    if (!username)
        return;
    try {
        currentUser = await userLogin(username);
        conversations = await getConversationsByUserId(currentUser.id);
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');
        startConversationButton.addEventListener('click', startConversation);
        renderConversations();
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
    catch (error) {
        console.error(error);
    }
}
function onConnected() {
    if (!stompClient)
        return;
    connectingElement.classList.add('hidden');
}
function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server.';
    connectingElement.style.color = 'red';
}
function sendMessage(event) {
    const messageContent = messageInput.value.trim();
    if (messageContent && stompClient && currentUser && currentConversationId != null) {
        const chatMessage = { senderId: currentUser.id, conversationId: currentConversationId, content: messageContent };
        console.log("sending message", chatMessage);
        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}
function onMessageReceived(payload) {
    console.log("received payload", payload);
    const message = JSON.parse(payload.body);
    const messageElement = document.createElement('li');
    messageElement.classList.add('chat-message');
    const textElement = document.createElement('p');
    textElement.appendChild(document.createTextNode(`User ${message.senderId}: ${message.content}`));
    messageElement.appendChild(textElement);
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}
async function startConversation(event) {
    console.log("Start conversation clicked");
    if (!currentUser)
        return;
    const recipientId = Number(recipientIdInput.value);
    console.log("currentUser", currentUser);
    console.log("recipientId", recipientId);
    let conversation = await createConversation(currentUser.id, recipientId);
    console.log("created conversation", conversation);
    currentConversationId = conversation.id;
    conversations.push(conversation);
    renderConversations();
    selectConversation(conversation);
    event.preventDefault();
}
function renderConversations() {
    conversationList.innerHTML = '';
    for (const conversation of conversations) {
        const conversationElement = document.createElement('button');
        conversationElement.textContent = `Conversation ${conversation.id}`;
        conversationElement.addEventListener('click', () => {
            selectConversation(conversation);
        });
        conversationList.appendChild(conversationElement);
    }
}
function selectConversation(conversation) {
    if (!stompClient)
        return;
    if (currentSubscription !== null)
        currentSubscription.unsubscribe();
    currentConversationId = conversation.id;
    currentSubscription = stompClient.subscribe(`/topic/conversations/${conversation.id}`, onMessageReceived);
}
usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);
//# sourceMappingURL=main.js.map