import {AcceptedConnectionResponse, IncomingConnectionRequestResponse, UserSummary} from "./types.js";
import {
    acceptConnectionRequest,
    getAcceptedConnections,
    getIncomingConnectionRequests,
    rejectConnectionRequest
} from "./api.js";
import {startConversationWith} from "./conversations.js";

let incomingConnections: IncomingConnectionRequestResponse[] = [];
let acceptedConnections: AcceptedConnectionResponse[] = [];
let connectionGeneration = 0;

const incomingConnectionsSection = document.querySelector('#incomingConnectionsSection') as HTMLElement;
const incomingConnectionsList = document.querySelector('#incomingConnectionsList') as HTMLElement;
const acceptedConnectionsList = document.querySelector('#acceptedConnectionsList') as HTMLElement;
const acceptedConnectionsSectionLabel = document.querySelector('#acceptedConnectionsSectionLabel') as HTMLElement;
const connectionError = document.querySelector("#connectionError") as HTMLElement;


export async function loadConnections(): Promise<void> {
    connectionError.textContent = "";

    const generationAtStart = ++connectionGeneration;

    try {
        const [incoming, accepted] = await Promise.all([
            getIncomingConnectionRequests(),
            getAcceptedConnections()
        ]);

        if (generationAtStart !== connectionGeneration) {
            return;
        }

        incomingConnections = incoming;
        acceptedConnections = accepted;

        renderConnections();
    } catch (error) {
        if (generationAtStart !== connectionGeneration) {
            return;
        }

        connectionError.textContent = "Couldn’t refresh connections. Try reopening the Connections tab.";


        throw error;
    }
}

export async function acceptConnection(connectionId: number): Promise<void> {
    await acceptConnectionRequest(connectionId);
    try {
        await loadConnections();
    } catch {
        // loadConnections already displays the synchronization error
    }
}

export async function rejectConnection(connectionId: number): Promise<void> {
    await rejectConnectionRequest(connectionId);
    try {
        await loadConnections();
    } catch {
        // loadConnections already displays the synchronization error
    }
}

function renderConnections(): void {
    const hasIncomingRequests = incomingConnections.length > 0;

    incomingConnectionsSection.classList.toggle(
        "hidden",
        !hasIncomingRequests
    );

    acceptedConnectionsSectionLabel.classList.toggle(
        "hidden",
        !hasIncomingRequests
    );

    renderIncomingConnections();
    renderAcceptedConnections();
}

function renderIncomingConnections(): void {
    incomingConnectionsList.innerHTML = "";

    for(const connection of incomingConnections) {
        createIncomingConnectionItem(connection);
    }
}

function createIncomingConnectionItem(incoming: IncomingConnectionRequestResponse): void {
    const connectionElement = document.createElement('div');
    connectionElement.classList.add('connection-item');

    const avatarElement = document.createElement('div');
    avatarElement.classList.add('connection-avatar');
    avatarElement.textContent = incoming.requestSenderSummary.displayName.charAt(0).toUpperCase() || '?';

    const displayNameElement = document.createElement('div');
    displayNameElement.classList.add('connection-display-name');
    displayNameElement.textContent = incoming.requestSenderSummary.displayName;

    const usernameElement = document.createElement('div');
    usernameElement.classList.add('connection-username');
    usernameElement.textContent = '@' + incoming.requestSenderSummary.username;

    const acceptButton = document.createElement('button');
    acceptButton.textContent = "Accept";
    acceptButton.type = "button";
    acceptButton.addEventListener("click", () => {
        void handleAcceptConnection(incoming.id, acceptButton, rejectButton);
    });

    const rejectButton = document.createElement('button');
    rejectButton.textContent = "Reject";
    rejectButton.type = "button";
    rejectButton.addEventListener("click", () => {
        void handleRejectConnection(incoming.id, acceptButton, rejectButton);
    });

    const identityElement = document.createElement("div");
    identityElement.classList.add("connection-identity");

    identityElement.appendChild(displayNameElement);
    identityElement.appendChild(usernameElement);

    const actionsElement = document.createElement("div");
    actionsElement.classList.add("connection-actions");

    acceptButton.classList.add("connection-action", "connection-action--accept");
    rejectButton.classList.add("connection-action", "connection-action--reject");

    actionsElement.appendChild(acceptButton);
    actionsElement.appendChild(rejectButton);

    connectionElement.appendChild(avatarElement);
    connectionElement.appendChild(identityElement);
    connectionElement.appendChild(actionsElement);

    incomingConnectionsList.appendChild(connectionElement);
}

async function handleAcceptConnection(connectionId: number, acceptButton: HTMLButtonElement, rejectButton: HTMLButtonElement): Promise<void> {
    connectionError.textContent = "";

    try {
        acceptButton.disabled = true;
        rejectButton.disabled = true;
        await acceptConnection(connectionId);
    } catch(error) {
        if(error instanceof Error) {
            connectionError.textContent = error.message;
        }
        acceptButton.disabled = false;
        rejectButton.disabled = false;
    }
}

async function handleRejectConnection(connectionId: number, acceptButton: HTMLButtonElement, rejectButton: HTMLButtonElement): Promise<void> {
    connectionError.textContent = "";

    try {
        acceptButton.disabled = true;
        rejectButton.disabled = true;
        await rejectConnection(connectionId);
    } catch(error) {
        if(error instanceof Error) {
            connectionError.textContent = error.message;
        }
        acceptButton.disabled = false;
        rejectButton.disabled = false;
    }
}

function renderAcceptedConnections(): void {
    acceptedConnectionsList.innerHTML = "";

    if (acceptedConnections.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.classList.add("connections-empty-state");
        emptyState.textContent = "No connections yet.";
        acceptedConnectionsList.appendChild(emptyState);
        return;
    }

    for(const connection of acceptedConnections) {
        createAcceptedConnectionItem(connection);
    }
}

function createAcceptedConnectionItem(accepted: AcceptedConnectionResponse): void {
    const connectionElement = document.createElement('div');
    connectionElement.classList.add('connection-item');

    const avatarElement = document.createElement('div');
    avatarElement.classList.add('connection-avatar');
    avatarElement.textContent = accepted.connectedUser.displayName.charAt(0).toUpperCase() || '?';

    const displayNameElement = document.createElement('div');
    displayNameElement.classList.add('connection-display-name');
    displayNameElement.textContent = accepted.connectedUser.displayName;

    const usernameElement = document.createElement('div');
    usernameElement.classList.add('connection-username');
    usernameElement.textContent = '@' + accepted.connectedUser.username;

    const identityElement = document.createElement("div");
    identityElement.classList.add("connection-identity");

    identityElement.appendChild(displayNameElement);
    identityElement.appendChild(usernameElement);

    const messageButton = document.createElement('button');
    messageButton.type = 'button';
    messageButton.classList.add('connection-message-button');
    messageButton.setAttribute(
        'aria-label',
        `Message ${accepted.connectedUser.displayName}`
    );

    messageButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-icon lucide-message-circle">
    <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>
    </svg>
`;

    messageButton.addEventListener('click', () => {
        void startConversationFromConnection(accepted.connectedUser, messageButton);
    });

    const optionsButton = document.createElement('button');
    optionsButton.type = 'button';
    optionsButton.classList.add('connection-options-button');
    optionsButton.setAttribute(
        'aria-label',
        `More options for ${accepted.connectedUser.displayName}`
    );

    optionsButton.innerHTML = '' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-icon lucide-ellipsis">' +
        '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>' +
        '</svg>'

    const controlsElement = document.createElement("div");
    controlsElement.classList.add("connection-controls");

    controlsElement.appendChild(messageButton);
    controlsElement.appendChild(optionsButton);

    connectionElement.appendChild(avatarElement);
    connectionElement.appendChild(identityElement);
    connectionElement.appendChild(controlsElement);

    acceptedConnectionsList.appendChild(connectionElement);
}

async function startConversationFromConnection(connectedUser: UserSummary, messageButton: HTMLButtonElement): Promise<void> {
    connectionError.textContent = "";

    try {
        messageButton.disabled = true;
        await startConversationWith(connectedUser);
    } catch (error) {
            console.error("Failed to start the conversation", error);
            connectionError.textContent = "Couldn’t start the conversation. Try again.";
    } finally {
        messageButton.disabled = false;
    }
}

export function clearConnections(): void {
    connectionGeneration++;

    incomingConnections = [];
    acceptedConnections = [];

    incomingConnectionsList.innerHTML = "";
    acceptedConnectionsList.innerHTML = "";
    incomingConnectionsSection.classList.add("hidden");
    acceptedConnectionsSectionLabel.classList.add("hidden");
    connectionError.textContent = "";
}

