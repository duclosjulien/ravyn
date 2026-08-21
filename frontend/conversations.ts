import {
    createConversation,
    getCurrentUserConversations,
    getMessagesForConversation,
    markConversationAsRead
} from "./api.js";
import {Conversation, MessageResponse, UserSummary} from "./types.js";
import {clearMessageArea, formatMessageTime, renderEmptyMessageState, renderMessage} from "./messages.js";
import {showConversationsView} from "./sidebar.js";

let currentUserId: number | null = null;
let conversations: Conversation[] = [];
let currentConversationId: number | null = null;
let conversationGeneration = 0;

const conversationList = document.querySelector('#conversationList') as HTMLElement;
const conversationError = document.querySelector('#conversationError') as HTMLElement;
const chatHeaderAvatar = document.querySelector('#chatHeaderAvatar') as HTMLElement;
const chatHeaderTitle = document.querySelector('#chatHeaderTitle') as HTMLElement;
const sendMessageButton = document.querySelector('#messageForm button') as HTMLButtonElement;
const messageInput = document.querySelector('#messageInput') as HTMLInputElement;


export async function initializeConversations(userId: number): Promise<void> {
    currentUserId = userId;
    conversations = await getCurrentUserConversations();

    sortConversationList();
    renderConversations();
    updateComposerState()
}

export async function startConversationWith(connectedUser: UserSummary): Promise<void> {
    const conversationId = await createConversation(connectedUser.id);

    if(!conversations.some(c => c.id === conversationId)){
        conversations.push({
            id: conversationId,
            otherUserId: connectedUser.id,
            otherUsername: connectedUser.username,
            lastMessageContent: null,
            lastMessageCreatedAt: null,
            lastMessageSenderId: null,
            needsAttention: false
        });
    }

    showConversationsView();
    await selectConversation(conversationId, connectedUser.username);
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

    if (conversation.needsAttention) {
        conversationElement.classList.add('conversation-item--needs-attention');
    }

    const avatarElement = document.createElement('div');
    avatarElement.classList.add('conversation-avatar');
    avatarElement.textContent = conversation.otherUsername.charAt(0).toUpperCase() || '?';

    const textContainer = document.createElement('div');
    textContainer.classList.add('conversation-text');

    const nameElement = document.createElement('div');
    nameElement.classList.add('conversation-name');
    nameElement.textContent = conversation.otherUsername;

    const attentionDotElement = document.createElement('span');
    attentionDotElement.classList.add('conversation-attention-dot');

    if (!conversation.needsAttention) {
        attentionDotElement.classList.add('hidden');
    }

    const previewElement = document.createElement('div');
    previewElement.classList.add('conversation-preview');

    if (conversation.lastMessageSenderId == null) {
        previewElement.textContent = "No messages yet";
    } else if (conversation.lastMessageSenderId === currentUserId) {
        previewElement.textContent = "You: " + conversation.lastMessageContent;
    } else {
        previewElement.textContent = conversation.lastMessageContent ?? "No messages yet";
    }

    const lastMessageTimeElement = document.createElement('div');
    lastMessageTimeElement.classList.add('conversation-lastMessageTime');
    lastMessageTimeElement.textContent = formatMessageTime(conversation.lastMessageCreatedAt);

    const conversationTopLine = document.createElement('div');
    conversationTopLine.classList.add('conversation-top-line');

    conversationTopLine.appendChild(nameElement);
    conversationTopLine.appendChild(attentionDotElement);
    conversationTopLine.appendChild(lastMessageTimeElement);

    textContainer.appendChild(conversationTopLine);
    textContainer.appendChild(previewElement);

    conversationElement.appendChild(avatarElement);
    conversationElement.appendChild(textContainer);

    conversationElement.addEventListener('click', () => {
        void selectConversation(conversation.id, conversation.otherUsername);
    });
    conversationList.appendChild(conversationElement);
}

async function selectConversation(conversationId: number, otherUsername: string): Promise<void> {
    ++conversationGeneration;
    const actionGeneration = conversationGeneration;

    clearMessageArea();
    hideConversationError();

    const selectedConversationId = conversationId;
    currentConversationId = selectedConversationId;

    renderConversations();
    updateComposerState();
    showConversationHeader(otherUsername);

    try {
        const previousMessages = await getMessagesForConversation(selectedConversationId);
        if (currentConversationId !== selectedConversationId ||
            actionGeneration !== conversationGeneration) {
            return;
        }
        previousMessages.forEach(renderMessage);
    } catch (error) {
        console.error("Failed to load message history", error);
        if(selectedConversationId === currentConversationId) {
            showConversationError("Couldn’t load earlier messages. Try selecting the conversation again.");
        }
        return;
    }

    try {
        await markConversationAsRead(selectedConversationId);
        if (currentConversationId !== selectedConversationId ||
            actionGeneration !== conversationGeneration) {
            return;
        }

        const selectedConversation = conversations.find(
            conversation => conversation.id === selectedConversationId
        );

        if (selectedConversation) {
            selectedConversation.needsAttention = false;
        }

        renderConversations();
    } catch (error) {
        console.error("Failed to mark the conversation as read", error);

        if (
            selectedConversationId === currentConversationId &&
            actionGeneration === conversationGeneration
        ) {
            showConversationError("Couldn’t update the conversation’s read status.");
        }
        return;
    }
}

export function updateConversationPreview(message: MessageResponse): void {
    const conversation = conversations.find(
        conversation => conversation.id === message.conversationId
    );

    if (!conversation)
        return;

    conversation.lastMessageContent = message.content;
    conversation.lastMessageCreatedAt = message.createdAt;
    conversation.lastMessageSenderId = message.senderId;

    if (message.conversationId === currentConversationId || message.senderId === currentUserId) {
        conversation.needsAttention = false;
    } else {
        conversation.needsAttention = true;
    }

    sortConversationList();
    renderConversations();
}

function updateComposerState(): void {
    if(currentConversationId === null) {
        showDefaultChatHeader();
        renderEmptyMessageState();
        messageInput.disabled = true;
        sendMessageButton.disabled = true;
        messageInput.placeholder = "Select a conversation to start messaging";
        return;
    }

    const conversation = conversations.find(conversation => conversation.id === currentConversationId);
    if(conversation === undefined) {
        messageInput.disabled = true;
        sendMessageButton.disabled = true;
        messageInput.placeholder = "Conversation unavailable";

    }
    else {
        messageInput.placeholder = conversation.lastMessageContent === null
            ? "Begin the conversation..."
            : "Write something thoughtful...";
        messageInput.disabled = false;
        sendMessageButton.disabled = false;
    }
}

function showConversationError(errorMessage: string): void {
    conversationError.classList.remove('hidden');
    conversationError.textContent = errorMessage;
}

function hideConversationError(): void {
    conversationError.classList.add('hidden');
    conversationError.textContent = "";
}


// ui
function showDefaultChatHeader(): void {
    chatHeaderAvatar.classList.add("hidden");
    chatHeaderTitle.textContent = "";
}

function showConversationHeader(username: string): void {
    chatHeaderAvatar.classList.remove("hidden");

    chatHeaderAvatar.textContent = username.charAt(0).toUpperCase();
    chatHeaderTitle.textContent = username;
}


// logout
export function clearConversations(): void {
    currentUserId = null;
    conversations = [];
    currentConversationId = null;
    conversationList.innerHTML = "";
    conversationError.textContent = "";
    chatHeaderAvatar.innerHTML = "";
    chatHeaderTitle.innerHTML = "";
    showDefaultChatHeader();
    clearMessageInput();
}


// utility functions
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

        return Date.parse(bTime) - Date.parse(aTime);
    });
}

export function clearMessageInput(): void {
    messageInput.value = "";
}

export function getTrimmedMessageInput(): string {
    return messageInput.value.trim()
}

export function getCurrentConversationId(): number | null {
    return currentConversationId;
}

