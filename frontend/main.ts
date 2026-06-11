'use strict';

import { OutgoingChatMessage, IncomingChatMessage, Conversation, StompPayload, User, MessageResponse } from './types.js';
import {
    createConversation,
    findUserByUsername,
    getConversationsByUserId,
    getMessagesForConversation, registerUser,
    userLogin
} from './api.js';

declare var SockJS: any;
declare var Stomp: any;

let stompClient: any = null;
let currentUser: User | null = null;
let currentConversationId: number | null = null;
let conversations: Conversation[] = [];
let currentSubscription: any = null;

const usernamePage = document.querySelector('#username-page') as HTMLElement;
const registerPage = document.querySelector('#register-page') as HTMLElement;
const chatPage = document.querySelector('#chat-page') as HTMLElement;
const usernameForm = document.querySelector('#usernameForm') as HTMLFormElement;
const registerForm = document.querySelector('#registerForm') as HTMLFormElement;
const messageForm = document.querySelector('#messageForm') as HTMLFormElement;
const messageInput = document.querySelector('#message') as HTMLInputElement;
const messageArea = document.querySelector('#messageArea') as HTMLElement;
const connectingElement = document.querySelector('.connecting') as HTMLElement;
const recipientUsernameInput = document.querySelector('#recipientUsername') as HTMLInputElement;
const conversationList = document.querySelector('#conversationList') as HTMLElement;
const startConversationButton = document.querySelector('#startConversationButton') as HTMLButtonElement;
const goToRegister = document.querySelector('#goToRegister') as HTMLButtonElement;
const goToLogin = document.querySelector('#goToLogin') as HTMLButtonElement;
const recipientError = document.querySelector('#recipientError') as HTMLElement;

async function enterApp(currentUser: User): Promise<void> {
    conversations = await getConversationsByUserId(currentUser.id);

    usernamePage.classList.add('hidden');
    registerPage.classList.add('hidden');
    chatPage.classList.remove('hidden');

    startConversationButton.addEventListener('click', startConversation);
    renderConversations();

    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
}

async function connect(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    const username: string = (document.querySelector('#name') as HTMLInputElement).value.trim();
    const password: string = (document.querySelector('#password') as HTMLInputElement).value;
    if(!username || !password)
        return;

    try {
        currentUser = await userLogin(username, password);
        await enterApp(currentUser);

    } catch (error) {
        console.error(error);
    }
}

async function register(event: SubmitEvent): Promise<void>{
    event.preventDefault();

    const username: string = (document.querySelector('#nameRegister') as HTMLInputElement).value.trim();
    const password: string = (document.querySelector('#passwordRegister') as HTMLInputElement).value;

    if(!username || !password)
        return;

    try {
        currentUser = await registerUser(username, password);
        await enterApp(currentUser);

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
    event.preventDefault();

    const messageContent = messageInput.value.trim();

    if(messageContent && stompClient && currentUser && currentConversationId != null) {
        const chatMessage: IncomingChatMessage = {senderId: currentUser.id, conversationId: currentConversationId,  content: messageContent};

        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
}

function onMessageReceived(payload: StompPayload): void {
    const message: OutgoingChatMessage = JSON.parse(payload.body);
    renderMessage(message);
}

function renderMessage(message: OutgoingChatMessage| MessageResponse): void {
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

    try {
        const conversationId = await createConversation(currentUser.id, recipientUser.id);
        recipientError.textContent = ""
        recipientUsernameInput.value = "";
        currentConversationId = conversationId;
        if(!conversations.some(c => c.id === conversationId)){
            conversations.push({ id: conversationId, otherUserId: recipientUser.id, otherUsername: recipientUser.username});
            renderConversations();
        }
        selectConversation(conversationId);
    }
    catch (error) {
        if (error instanceof Error) {
            recipientError.textContent = error.message;
        }
    }
}

function renderConversations(): void {
    conversationList.innerHTML = '';
    for (const conversation of conversations)
        createConversationButton(conversation);
}

function createConversationButton(conversation: Conversation): void{
    const conversationElement = document.createElement('button');
    conversationElement.classList.add('conversation-item');

    const avatarElement = document.createElement('div');
    avatarElement.classList.add('conversation-avatar');
    avatarElement.textContent = conversation.otherUsername.charAt(0).toUpperCase() || '?';

    const textContainer = document.createElement('div');
    textContainer.classList.add('conversation-text');

    const nameElement = document.createElement('div');
    nameElement.classList.add('conversation-name');
    nameElement.textContent = conversation.otherUsername;

    const previewElement = document.createElement('div');
    previewElement.classList.add('conversation-preview');
    previewElement.textContent = 'No messages yet';

    textContainer.appendChild(nameElement);
    textContainer.appendChild(previewElement);

    conversationElement.appendChild(avatarElement);
    conversationElement.appendChild(textContainer);

    conversationElement.addEventListener('click', () => {
        selectConversation(conversation.id);
    });
    conversationList.appendChild(conversationElement);
}

async function selectConversation(conversationId: number) {
    if (!stompClient)
        return;

    if (currentSubscription !== null)
        currentSubscription.unsubscribe();

    messageArea.textContent = "";

    const selectedConversationId = conversationId;
    currentConversationId = selectedConversationId;

    currentSubscription = stompClient.subscribe(
        `/topic/conversations/${selectedConversationId}`,
        onMessageReceived
    );
    try {
        const previousMessages = await getMessagesForConversation(selectedConversationId);

        if (currentConversationId !== selectedConversationId)
            return;

        previousMessages.forEach(renderMessage);
    } catch (error) {
        console.error("Failed to load message history", error);
    }
}

usernameForm.addEventListener('submit', connect, true);
registerForm.addEventListener('submit', register, true);
messageForm.addEventListener('submit', sendMessage, true);

goToRegister.addEventListener('click', () => {
    usernamePage.classList.add('hidden');
    registerPage.classList.remove('hidden');
});
goToLogin.addEventListener('click', () => {
    registerPage.classList.add('hidden');
    usernamePage.classList.remove('hidden');
});