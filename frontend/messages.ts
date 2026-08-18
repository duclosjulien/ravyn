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

    const title = document.createElement('h3');
    title.textContent = 'Select a conversation';

    const description = document.createElement('p');
    description.textContent =
        'Search Ravyn or choose someone from your conversations.';

    emptyState.appendChild(title);
    emptyState.appendChild(description);
    messageArea.appendChild(emptyState);
}


// logout
export function clearMessages(): void {
    currentUserId = null;
    clearMessageArea();
}