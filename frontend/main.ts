'use strict';

import {ChatMessage, Conversation, StompPayload, User} from './types';
import {createConversation, userLogin} from './api';

declare var SockJS: any;
declare var Stomp: any;

let stompClient: any = null;
let currentUser: User | null = null;
let currentConversationId: number | null = null;

const usernamePage = document.querySelector('#username-page') as HTMLElement;
const chatPage = document.querySelector('#chat-page') as HTMLElement;
const usernameForm = document.querySelector('#usernameForm') as HTMLFormElement;
const messageForm = document.querySelector('#messageForm') as HTMLFormElement;
const messageInput = document.querySelector('#message') as HTMLInputElement;
const messageArea = document.querySelector('#messageArea') as HTMLElement;
const connectingElement = document.querySelector('.connecting') as HTMLElement;
const recipientIdInput = document.querySelector('#recipientId') as HTMLInputElement;

async function connect(event: SubmitEvent): Promise<void> {
    let username: string = (document.querySelector('#name') as HTMLInputElement).value.trim();
    if(!username)
        return;

    currentUser = await userLogin(username);
    if(currentUser) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected(): void {
    if(!stompClient)
        return;
    connectingElement.classList.add('hidden');
}

function onError(error: unknown): void {
    connectingElement.textContent = 'Could not connect to WebSocket server.';
    connectingElement.style.color = 'red';
}

function sendMessage(event: SubmitEvent): void {
    const messageContent = messageInput.value.trim();

    if(messageContent && stompClient && currentUser && currentConversationId != null) {
        const chatMessage: ChatMessage = {senderId: currentUser.id, conversationId: currentConversationId,  content: messageContent};

        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }

    event.preventDefault();
}

function onMessageReceived(payload: StompPayload): void {
    const message: ChatMessage = JSON.parse(payload.body);

    const messageElement = document.createElement('li');
    messageElement.classList.add('chat-message');

    const textElement = document.createElement('p');
    textElement.appendChild(
        document.createTextNode(`User ${message.senderId}: ${message.content}`)
    );

    messageElement.appendChild(textElement);
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

async function startConversation(event: MouseEvent): Promise<void> {
    if(!currentUser)
        return;

    const recipientId = Number(recipientIdInput.value);
    let conversation =  await createConversation(currentUser.id, recipientId);
    currentConversationId = conversation.id;

    event.preventDefault();
}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);