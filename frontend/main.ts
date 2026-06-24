'use strict';

import { MessageRequest, Conversation, StompPayload, User, MessageResponse } from './types.js';
import {
    createConversation,
    findUserByUsername,
    getCurrentUser,
    getCurrentUserConversations,
    getMessagesForConversation,
    registerUser,
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
const sendMessageButton = document.querySelector('#messageForm button') as HTMLButtonElement;
const messageArea = document.querySelector('#messageArea') as HTMLElement;
const connectingElement = document.querySelector('.connecting') as HTMLElement;
const recipientUsernameInput = document.querySelector('#recipientUsername') as HTMLInputElement;
const conversationList = document.querySelector('#conversationList') as HTMLElement;
const startConversationButton = document.querySelector('#startConversationButton') as HTMLButtonElement;
const goToRegister = document.querySelector('#goToRegister') as HTMLButtonElement;
const goToLogin = document.querySelector('#goToLogin') as HTMLButtonElement;
const recipientError = document.querySelector('#recipientError') as HTMLElement;
const loginError = document.querySelector('#loginError') as HTMLElement;
const registerError = document.querySelector('#registerError') as HTMLElement;
const registerButton = document.querySelector('#registerButton') as HTMLButtonElement;
const loginButton = document.querySelector('#loginButton') as HTMLButtonElement;
const chatHeaderAvatar = document.querySelector('#chatHeaderAvatar') as HTMLElement;
const chatHeaderTitle = document.querySelector('#chatHeaderTitle') as HTMLElement;
const chatHeaderStatus = document.querySelector('#chatHeaderStatus') as HTMLElement;

async function enterApp(): Promise<void> {
    conversations = await getCurrentUserConversations();

    usernamePage.classList.add('hidden');
    registerPage.classList.add('hidden');
    chatPage.classList.remove('hidden');
    updateComposerState();

    startConversationButton.addEventListener('click', startConversation);
    renderConversations();

    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
}

async function connect(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    loginError.textContent = "";

    const username: string = (document.querySelector('#name') as HTMLInputElement).value.trim();
    const password: string = (document.querySelector('#password') as HTMLInputElement).value;
    if(!username || !password)
        return;

    try {
        loginButton.disabled = true;
        await userLogin(username, password);
        currentUser = await getCurrentUser();
    } catch (error) {
        if(error instanceof Error)
            loginError.textContent = error.message;
        console.error(error);
        return;
    } finally {
        loginButton.disabled = false;
    }
    await enterApp();
}

async function register(event: SubmitEvent): Promise<void>{
    event.preventDefault();
    registerError.textContent = "";

    const username: string = (document.querySelector('#nameRegister') as HTMLInputElement).value.trim();
    const password: string = (document.querySelector('#passwordRegister') as HTMLInputElement).value;

    if(!username || !password)
        return;

    try {
        registerButton.disabled = true;
        await registerUser(username, password);
        currentUser = await getCurrentUser();
    } catch (error) {
        if(error instanceof Error)
            registerError.textContent = error.message;
        console.error(error);
        return;
    } finally {
        registerButton.disabled = false;
    }
    await enterApp();
}

function onConnected(): void {
    if(!stompClient)
        return;

    connectingElement.classList.add('hidden');
}

function onError(): void {
    connectingElement.textContent = 'Could not connect to WebSocket server.';
    connectingElement.style.color = 'red';
}

function sendMessage(event: SubmitEvent): void {
    event.preventDefault();

    const messageContent = messageInput.value.trim();

    if(messageContent && stompClient && currentUser && currentConversationId != null) {
        const chatMessage: MessageRequest = {conversationId: currentConversationId,  content: messageContent};

        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
}

function onMessageReceived(payload: StompPayload): void {
    const message: MessageResponse = JSON.parse(payload.body);
    renderMessage(message);
}

function renderMessage(message: MessageResponse): void {
    const messageElement = document.createElement('li');

    messageElement.classList.add('chat-message');
    if(currentUser?.id === message.senderId)
        messageElement.classList.add('chat-message--outgoing');
    else
        messageElement.classList.add('chat-message--incoming');

    const textElement = document.createElement('p');
    textElement.appendChild(
        document.createTextNode(`${message.content}`)
    );

    const timestampElement = document.createElement('span');
    timestampElement.classList.add('message-time');
    timestampElement.textContent = formatMessageTime(message.createdAt);

    messageElement.appendChild(textElement);
    messageElement.appendChild(timestampElement);
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function formatMessageTime(createdAt: string): string {
    return new Date(createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}

async function startConversation(event: MouseEvent): Promise<void> {
    event.preventDefault();

    const recipientUser = await findUserByUsername(recipientUsernameInput.value.trim());
    if(recipientUser == null) {
        recipientError.textContent = "User not found";
        return;
    }

    try {
        const conversationId = await createConversation(recipientUser.id);
        recipientError.textContent = ""
        recipientUsernameInput.value = "";

        if(!conversations.some(c => c.id === conversationId)){
            conversations.push({
                id: conversationId,
                otherUserId: recipientUser.id,
                otherUsername: recipientUser.username,
                lastMessageContent: null,
                lastMessageCreatedAt: null
            });
            renderConversations();
        }
        await selectConversation(conversationId, recipientUser.username);
    }
    catch (error) {
        if (error instanceof Error)
            recipientError.textContent = error.message;
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

    if(conversation.id === currentConversationId)
        conversationElement.classList.add('conversation-item--active');

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
    previewElement.textContent = conversation.lastMessageContent ?? 'No messages yet';

    textContainer.appendChild(nameElement);
    textContainer.appendChild(previewElement);

    conversationElement.appendChild(avatarElement);
    conversationElement.appendChild(textContainer);

    conversationElement.addEventListener('click', () => {
        selectConversation(conversation.id, conversation.otherUsername);
    });
    conversationList.appendChild(conversationElement);
}

async function selectConversation(conversationId: number, otherUsername: string) {
    if (!stompClient)
        return;

    if (currentSubscription !== null)
        currentSubscription.unsubscribe();

    messageArea.textContent = "";

    const selectedConversationId = conversationId;
    currentConversationId = selectedConversationId;

    updateComposerState();

    chatHeaderAvatar.textContent = otherUsername.charAt(0).toUpperCase();
    chatHeaderTitle.textContent = otherUsername;
    chatHeaderStatus.textContent = "Online";

    renderConversations();

    currentSubscription = stompClient.subscribe(
        `/topic/conversations/${selectedConversationId}`,
        onMessageReceived
    );
    try {
        const previousMessages = await getMessagesForConversation(selectedConversationId);

        if (currentConversationId !== selectedConversationId)
            return;
        console.log("printing previous messages");

        previousMessages.forEach(renderMessage);
    } catch (error) {
        console.error("Failed to load message history", error);
    }
}

function updateComposerState(): void {
    const hasSelectedConversation = currentConversationId !== null;

    messageInput.disabled = !hasSelectedConversation;
    sendMessageButton.disabled = !hasSelectedConversation;

    messageInput.placeholder = hasSelectedConversation
        ? 'Write something thoughtful...'
        : 'Select a conversation to start messaging';
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