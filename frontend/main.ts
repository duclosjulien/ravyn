'use strict';

import { MessageRequest, Conversation, StompPayload, User, MessageResponse } from './types.js';
import {
    createConversation,
    findUserByUsername,
    getCurrentUser,
    getCurrentUserConversations,
    getMessagesForConversation,
    registerUser,
    userLogin, userLogout
} from './api.js';

declare var SockJS: any;
declare var Stomp: any;

let stompClient: any = null;
let currentUser: User | null = null;
let currentConversationId: number | null = null;
let conversations: Conversation[] = [];
let inboxSubscription: any = null;

const bootPage = document.querySelector('#boot-page') as HTMLElement;
const bootPageMessage = document.querySelector('#boot-page-message') as HTMLElement;
const usernamePage = document.querySelector('#username-page') as HTMLElement;
const registerPage = document.querySelector('#register-page') as HTMLElement;
const chatPage = document.querySelector('#chat-page') as HTMLElement;
const usernameForm = document.querySelector('#usernameForm') as HTMLFormElement;
const registerForm = document.querySelector('#registerForm') as HTMLFormElement;
const messageForm = document.querySelector('#messageForm') as HTMLFormElement;
const messageInput = document.querySelector('#message') as HTMLInputElement;
const sendMessageButton = document.querySelector('#messageForm button') as HTMLButtonElement;
const messageArea = document.querySelector('#messageArea') as HTMLElement;
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
const logoutButton = document.querySelector('#logoutButton') as HTMLElement;
const chatHeaderAvatar = document.querySelector('#chatHeaderAvatar') as HTMLElement;
const chatHeaderTitle = document.querySelector('#chatHeaderTitle') as HTMLElement;
const chatHeaderStatus = document.querySelector('#chatHeaderStatus') as HTMLElement;

async function startUp(): Promise<void> {
    showBootPage();
    try {
        currentUser = await getCurrentUser();
    } catch(error) {
        showLoginPage();
        return;
    }

    try {
        await enterApp();
    } catch(error) {
        console.error(error);
        showErrorPage();
    }
}

async function enterApp(): Promise<void> {
    conversations = await getCurrentUserConversations();
    sortConversationList();
    renderConversations();


    showChatPage();
    updateComposerState();

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

    try {
        await enterApp();
    } catch(error) {
        console.error(error);
        showErrorPage();
    }
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

    try {
        await enterApp();
    } catch(error){
        console.error(error);
        showErrorPage();
    }
}

function onConnected(): void {
    if(!stompClient)
        return;

    if (inboxSubscription !== null)
        inboxSubscription.unsubscribe();

    inboxSubscription = stompClient.subscribe('/user/queue/messages', onMessageReceived);
}

function onError(): void {
    // TODO: Show a non-blocking WebSocket connection status in the chat UI.
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

    updateConversationPreview(message);

    if (message.conversationId === currentConversationId)
        renderMessage(message);
}

function updateConversationPreview(message: MessageResponse): void {
    const conversation = conversations.find(
        conversation => conversation.id === message.conversationId
    );

    if (!conversation)
        return;

    conversation.lastMessageContent = message.content;
    conversation.lastMessageCreatedAt = message.createdAt;
    conversation.lastMessageSenderId = message.senderId;

    sortConversationList();
    renderConversations();
}

function sortConversationList(): void {
    conversations.sort((a, b) => {
        const aTime = a.lastMessageCreatedAt;
        const bTime = b.lastMessageCreatedAt;

        if (aTime == null && bTime == null)
            return 0;

        if (aTime == null)
            return 1;

        if (bTime == null)
            return -1;

        return bTime.localeCompare(aTime);
    });
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

function formatMessageTime(createdAt: string | null): string {
    if(createdAt == null)
        return '';

    const today = new Date().setHours(0, 0, 0 ,0);
    const messageDate = new Date(createdAt).setHours(0, 0, 0, 0);

    if(today === messageDate) {
        return new Date(createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const oneDay = 24 * 60 * 60 * 1000
    if(today === messageDate + oneDay){
        return "Yesterday";
    }

    return new Date(createdAt).toLocaleDateString();
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
                lastMessageCreatedAt: null,
                lastMessageSenderId: null
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

    if (conversation.lastMessageSenderId == null) {
        previewElement.textContent = "No messages yet";
    } else if (conversation.lastMessageSenderId === currentUser?.id) {
        previewElement.textContent = "You: " + conversation.lastMessageContent;
    } else {
        previewElement.textContent = conversation.lastMessageContent ?? "No messages yet";
    }

    const lastMessageTimeElement = document.createElement('div');
    lastMessageTimeElement.classList.add('conversation-lastMessageTime');
    lastMessageTimeElement.textContent = formatMessageTime(conversation.lastMessageCreatedAt);

    textContainer.appendChild(nameElement);
    textContainer.appendChild(previewElement);
    textContainer.appendChild(lastMessageTimeElement);

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

    messageArea.textContent = "";

    const selectedConversationId = conversationId;
    currentConversationId = selectedConversationId;

    updateComposerState();

    chatHeaderAvatar.textContent = otherUsername.charAt(0).toUpperCase();
    chatHeaderTitle.textContent = otherUsername;
    chatHeaderStatus.textContent = "Online";

    renderConversations();

    try {
        const previousMessages = await getMessagesForConversation(selectedConversationId);

        if (currentConversationId !== selectedConversationId)
            return;

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

const allPages = [bootPage, usernamePage, registerPage, chatPage];

function showPage(page: HTMLElement) {
    allPages.forEach(p => p.classList.toggle('hidden', p !== page));
}

function showLoginPage(){
    showPage(usernamePage);
}

function showRegisterPage(){
    showPage(registerPage);
}

function showChatPage(){
    showPage(chatPage);
}

function showBootPage() {
    bootPageMessage.textContent = "Loading Ravyn..."
    showPage(bootPage);
}

function showErrorPage() {
    bootPageMessage.textContent = "Could not load Ravyn. Please refresh.";
    showPage(bootPage);
}

usernameForm.addEventListener('submit', connect, true);
registerForm.addEventListener('submit', register, true);
messageForm.addEventListener('submit', sendMessage, true);
startConversationButton.addEventListener('click', startConversation);

goToRegister.addEventListener('click', () => {
    showRegisterPage();
});
goToLogin.addEventListener('click', () => {
    showLoginPage();
});

logoutButton.addEventListener('click', () => {
    userLogout();
    showLoginPage();
})

startUp();
