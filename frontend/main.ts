'use strict';

import {ChatMessage, Conversation, StompPayload, User} from './types';
import {createConversation, getConversationsByUserId, userLogin} from './api';

import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient: any = null;
let currentUser: User | null = null;
let currentConversationId: number | null = null;
let conversations: Conversation[] = [];
let currentSubscription: StompSubscription | null = null;

const usernamePage = document.querySelector('#username-page') as HTMLElement;
const chatPage = document.querySelector('#chat-page') as HTMLElement;
const usernameForm = document.querySelector('#usernameForm') as HTMLFormElement;
const messageForm = document.querySelector('#messageForm') as HTMLFormElement;
const messageInput = document.querySelector('#message') as HTMLInputElement;
const messageArea = document.querySelector('#messageArea') as HTMLElement;
const connectingElement = document.querySelector('.connecting') as HTMLElement;
const recipientIdInput = document.querySelector('#recipientId') as HTMLInputElement;
const conversationList = document.querySelector('#conversationList') as HTMLElement;

async function connect(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    const username: string = (document.querySelector('#name') as HTMLInputElement).value.trim();
    if(!username)
        return;

    try {
        currentUser = await userLogin(username);
        conversations = await getConversationsByUserId(currentUser.id);

        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');
        renderConversations();

        stompClient = new Client({
            webSocketFactory: () => new SockJS('/ws'),
            reconnectDelay: 5000,
        });
        stompClient.onConnect = onConnected;
        stompClient.onStompError = onError;
        stompClient.activate();

    } catch (error) {
        console.error(error);
    }
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

function renderConversations(): void {
    conversationList.innerHTML = '';
    for (const conversation of conversations) {
        const conversationElement = document.createElement('button');
        conversationElement.textContent = `Conversation ${conversation.id}`;

        // click handler
        conversationElement.addEventListener('click', () => {
            if (!stompClient)
                return;

            if (currentSubscription !== null)
                currentSubscription.unsubscribe();


            currentConversationId = conversation.id;

            currentSubscription = stompClient.subscribe(
                `/topic/conversations/${conversation.id}`,
                onMessageReceived
            );

        });
        conversationList.appendChild(conversationElement);
    }
}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);