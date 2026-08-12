import {AcceptedConnectionResponse, IncomingConnectionRequestResponse} from "./types.js";
import {
    acceptConnectionRequest,
    getAcceptedConnections,
    getIncomingConnectionRequests,
    rejectConnectionRequest
} from "./api.js";

let incomingConnections: IncomingConnectionRequestResponse[] = [];
let acceptedConnections: AcceptedConnectionResponse[] = [];

const incomingConnectionsSection = document.querySelector('#incomingConnectionsSection') as HTMLElement;
const incomingConnectionsList = document.querySelector('#incomingConnectionsList') as HTMLElement;
const acceptedConnectionsList = document.querySelector('#acceptedConnectionsList') as HTMLElement;
const connectionError = document.querySelector("#connectionError") as HTMLElement;


export async function loadConnections(): Promise<void> {
    connectionError.textContent = "";
    try {
        const [incoming, accepted] = await Promise.all([
            getIncomingConnectionRequests(),
            getAcceptedConnections()
        ]);

        incomingConnections = incoming;
        acceptedConnections = accepted;

        renderConnections();
    } catch (error) {
        if(error instanceof Error) {
            connectionError.textContent = error.message;
        }
        throw error;
    }
}

export async function acceptConnection(connectionId: number): Promise<void> {
    await acceptConnectionRequest(connectionId);
    await loadConnections();
}

export async function rejectConnection(connectionId: number):Promise<void> {
    await rejectConnectionRequest(connectionId);
    await loadConnections();
}

function renderConnections(): void {
    renderIncomingConnections();
    renderAcceptedConnections();
}

function renderIncomingConnections(): void {
    incomingConnectionsList.innerHTML = "";

    if(incomingConnections.length === 0) {
        incomingConnectionsSection.classList.add("hidden");
    } else {
        incomingConnectionsSection.classList.remove("hidden");
    }

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

    connectionElement.appendChild(avatarElement);
    connectionElement.appendChild(identityElement);

    acceptedConnectionsList.appendChild(connectionElement);
}
