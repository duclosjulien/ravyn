'use strict';

import { MessageRequest, StompPayload, User, MessageResponse } from './types.js';
import {
    getCurrentUser,
    markConversationAsRead,
    registerUser,
    userLogin,
    userLogout
} from './api.js';

import {initializeAccountMenu, loadAccountMenu, clearAccountMenu} from './accountMenu.js';

import {ApiError} from "./errors.js";
import {initializeSettingsMenu} from "./settings.js";
import {initializeUserSearch} from "./userSearch.js";
import {initializeSidebar} from "./sidebar.js";
import {clearConnections, loadConnections} from "./connections.js";
import {
    clearConversations,
    clearMessageInput,
    getCurrentConversationId,
    getTrimmedMessageInput,
    initializeConversations,
    updateConversationPreview
} from "./conversations.js";
import {clearMessages, initializeMessages, renderMessage} from "./messages.js";

declare var SockJS: any;
declare var Stomp: any;

let stompClient: any = null;
let currentUser: User | null = null;
let inboxSubscription: any = null;
let connectionStateSubscription: any = null;

const bootPage = document.querySelector('#boot-page') as HTMLElement;
const bootPageMessage = document.querySelector('#boot-page-message') as HTMLElement;
const usernamePage = document.querySelector('#username-page') as HTMLElement;
const registerPage = document.querySelector('#register-page') as HTMLElement;
const chatPage = document.querySelector('#chat-page') as HTMLElement;
const usernameForm = document.querySelector('#usernameForm') as HTMLFormElement;
const registerForm = document.querySelector('#registerForm') as HTMLFormElement;
const messageForm = document.querySelector('#messageForm') as HTMLFormElement;
const goToRegister = document.querySelector('#goToRegister') as HTMLButtonElement;
const goToLogin = document.querySelector('#goToLogin') as HTMLButtonElement;
const loginError = document.querySelector('#loginError') as HTMLElement;
const registerError = document.querySelector('#registerError') as HTMLElement;
const registerButton = document.querySelector('#registerButton') as HTMLButtonElement;
const loginButton = document.querySelector('#loginButton') as HTMLButtonElement;
const logoutButton = document.querySelector('#logoutButton') as HTMLElement;



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
    if(currentUser === null) {
        // write a user-friendly error somewhere
        return;
    }
    await initializeConversations(currentUser.id);
    initializeMessages(currentUser.id)
    await loadAccountMenu();

    showChatPage();

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
        console.error(error);
        if(error instanceof ApiError && error.errorCode === "ALREADY_AUTHENTICATED") {
            await recoverAlreadyAuthenticated();
        }

        else if(error instanceof Error) {
            loginError.textContent = error.message;
        }
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
        console.error(error);
        if(error instanceof ApiError && error.errorCode === "ALREADY_AUTHENTICATED") {
            await recoverAlreadyAuthenticated();
        }

        else if(error instanceof Error) {
            registerError.textContent = error.message;
        }
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

async function recoverAlreadyAuthenticated(): Promise<void> {
    try {
        currentUser = await getCurrentUser();
        await enterApp();
    } catch (innerError) {
        console.error(innerError);
        showErrorPage();
    }
}

function onConnected(): void {
    if(!stompClient)
        return;

    if (inboxSubscription !== null)
        inboxSubscription.unsubscribe();
    if (connectionStateSubscription !== null)
        connectionStateSubscription.unsubscribe();

    inboxSubscription = stompClient.subscribe('/user/queue/messages', onMessageReceived);
    connectionStateSubscription = stompClient.subscribe('/user/queue/connection-state', onConnectionStateChanged);
}

function onError(): void {
    // TODO: Show a non-blocking WebSocket connection status in the chat UI.
}

function sendMessage(event: SubmitEvent): void {
    event.preventDefault();

    const messageContent = getTrimmedMessageInput();
    const currentConversationId = getCurrentConversationId();

    if(messageContent && stompClient && currentUser && currentConversationId != null) {
        const chatMessage: MessageRequest = {conversationId: currentConversationId,  content: messageContent};

        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        clearMessageInput();
    }
}

async function onMessageReceived(payload: StompPayload): Promise<void> {
    const message: MessageResponse = JSON.parse(payload.body);

    updateConversationPreview(message);

    const messageConversationId = message.conversationId;
    const currentConversationId = getCurrentConversationId();

    if (messageConversationId === currentConversationId) {
        renderMessage(message);
        await markConversationAsRead(currentConversationId);
    }
}

async function onConnectionStateChanged(): Promise<void> {
    try {
        await loadConnections();
    } catch (error) {
        console.error("Failed to refresh connection state", error);
    }
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
    bootPageMessage.textContent = "Loading Ravyn...";
    showPage(bootPage);
}

function showErrorPage() {
    bootPageMessage.textContent = "Could not load Ravyn. Please refresh.";
    showPage(bootPage);
}

async function logout() {
    clearAccountMenu();
    clearConnections();
    clearConversations();
    clearMessages();
    currentUser = null;

    try {
        await userLogout();
    } catch(error) {
        console.error(error);
    } finally {
        if (inboxSubscription !== null){
            inboxSubscription.unsubscribe();
            inboxSubscription = null;
        }
        if (connectionStateSubscription !== null) {
            connectionStateSubscription.unsubscribe();
            connectionStateSubscription = null;
        }
        if (stompClient){
            stompClient.disconnect();
            stompClient = null;
        }
        showLoginPage();
    }
}

usernameForm.addEventListener('submit', connect, true);
registerForm.addEventListener('submit', register, true);
messageForm.addEventListener('submit', sendMessage, true);

goToRegister.addEventListener('click', () => {
    showRegisterPage();
});
goToLogin.addEventListener('click', () => {
    showLoginPage();
});

logoutButton.addEventListener('click', () => {
    void logout();
});

initializeAccountMenu();
initializeSettingsMenu();
initializeUserSearch();
initializeSidebar();

void startUp();
