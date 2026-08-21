import {MessageResponse} from "./types.js";

let currentUserId: number | null = null;

const messageArea = document.querySelector('#messageArea') as HTMLElement;

export function initializeMessages(userId: number): void {
    currentUserId = userId;
}

export function renderMessage(message: MessageResponse): void {
    const messageElement = document.createElement('li');

    messageElement.classList.add('chat-message');
    if(currentUserId === message.senderId)
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

    const wasNearBottom = isNearBottom();
    messageArea.appendChild(messageElement);
    if (message.senderId === currentUserId || wasNearBottom) {
        messageArea.scrollTop = messageArea.scrollHeight;
    }
}

function isNearBottom(): boolean {
    const distanceFromBottom =
        messageArea.scrollHeight
        - messageArea.scrollTop
        - messageArea.clientHeight;

    return distanceFromBottom < 80;
}


export function formatMessageTime(createdAt: string | null): string {
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

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate === yesterday.getTime()) {
        return "Yesterday";
    }

    return new Date(createdAt).toLocaleDateString();
}

export function clearMessageArea(): void {
    messageArea.textContent = "";
}

export function renderEmptyMessageState(): void {
    clearMessageArea();

    const emptyState = document.createElement('li');
    emptyState.classList.add('empty-chat-state');

    const icon = document.createElement('div');
    icon.classList.add('empty-chat-icon');
    icon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
    `;

    const title = document.createElement('h3');
    title.textContent = 'Select a conversation';

    const description = document.createElement('p');
    description.textContent =
        'Search Ravyn or choose someone from your conversations.';

    emptyState.appendChild(icon);
    emptyState.appendChild(title);
    emptyState.appendChild(description);
    messageArea.appendChild(emptyState);
}


// logout
export function clearMessages(): void {
    currentUserId = null;
    clearMessageArea();
}