'use strict';

import { OutgoingChatMessage, IncomingChatMessage, Conversation, StompPayload, User, UserSummary } from './types.js';
import {createConversation, findUserByUsername, getConversationsByUserId, userLogin} from './api.js';

declare var SockJS: any;
declare var Stomp: any;

let stompClient: any = null;
let currentUser: User | null = null;
let currentConversationId: number | null = null;
let conversations: Conversation[] = [];
let currentSubscription: any = null;

const usernamePage = document.querySelector('#username-page') as HTMLElement;
const chatPage = document.querySelector('#chat-page') as HTMLElement;
const usernameForm = document.querySelector('#usernameForm') as HTMLFormElement;
const messageForm = document.querySelector('#messageForm') as HTMLFormElement;
const messageInput = document.querySelector('#message') as HTMLInputElement;
const messageArea = document.querySelector('#messageArea') as HTMLElement;
const connectingElement = document.querySelector('.connecting') as HTMLElement;
const recipientUsernameInput = document.querySelector('#recipientUsername') as HTMLInputElement;
const conversationList = document.querySelector('#conversationList') as HTMLElement;
const startConversationButton = document.querySelector('#startConversationButton') as HTMLInputElement;
const recipientError = document.querySelector('#recipientError') as HTMLElement;

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
        startConversationButton.addEventListener('click', startConversation);
        renderConversations();

        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);

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
        const chatMessage: IncomingChatMessage = {senderId: currentUser.id, conversationId: currentConversationId,  content: messageContent};

        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }

    event.preventDefault();
}

function onMessageReceived(payload: StompPayload): void {
    console.log("received payload", payload);
    const message: OutgoingChatMessage = JSON.parse(payload.body);

    const messageElement = document.createElement('li');
    messageElement.classList.add('chat-message');

    const textElement = document.createElement('p');
    textElement.appendChild(
        document.createTextNode(`${message.senderUsername}: ${message.content}`)
    );

    messageElement.appendChild(textElement);
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

async function startConversation(event: MouseEvent): Promise<void> {
    event.preventDefault();
    if(!currentUser) return;

    const recipientUser = await findUserByUsername(recipientUsernameInput.value.trim());
    if(recipientUser == null) {
        recipientError.textContent = "User not found";
        return;
    }

    recipientError.textContent = "";
    recipientUsernameInput.value = "";
    
    let conversation =  await createConversation(currentUser.id, recipientUser.id);

    currentConversationId = conversation.id;
    if(!conversations.some(c => c.id === conversation.id)){
        conversations.push(conversation);
        renderConversations();
    }
    selectConversation(conversation);
}

function renderConversations(): void {
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

function selectConversation(conversation: Conversation) {
    if (!stompClient)
        return;

    if (currentSubscription !== null)
        currentSubscription.unsubscribe();

    currentConversationId = conversation.id;
    currentSubscription = stompClient.subscribe(`/topic/conversations/${conversation.id}`, onMessageReceived);
}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);