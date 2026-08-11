import {acceptConnectionRequest, findUserByUsername, rejectConnectionRequest, requestConnection} from "./api.js";
import {ConnectionRelationshipState, UserSearchResponse} from "./types.js";

const userSearchForm = document.querySelector('#userSearchForm') as HTMLFormElement;
const userSearchUsernameInput = document.querySelector('#userSearchUsernameInput') as HTMLInputElement;
const userSearchError = document.querySelector('#userSearchError') as HTMLElement;
const userSearchResult = document.querySelector('#userSearchResult') as HTMLElement;
const userSearchDisplayName = document.querySelector('#userSearchDisplayName') as HTMLElement;
const userSearchUsername = document.querySelector('#userSearchUsername') as HTMLElement;
const userSearchAction = document.querySelector('#userSearchAction') as HTMLElement;
const userSearchStatus = document.querySelector("#userSearchStatus") as HTMLElement;

export function initializeUserSearch() {
    userSearchForm.addEventListener('submit', searchUser);
}

async function searchUser(event: SubmitEvent) {
    event.preventDefault();

    userSearchError.textContent = "";
    userSearchResult.classList.add("hidden");

    const username = userSearchUsernameInput.value.trim();

    if (!username) {
        userSearchError.textContent = "Enter a username";
        return;
    }

    try {
        userSearchUsernameInput.disabled = true;
        userSearchStatus.textContent = "Searching…";

        const searchResult = await findUserByUsername(username);
        if(searchResult == null) {
            userSearchError.textContent = "User not found";
            return;
        }

        renderUserSearchResult(searchResult);
        userSearchError.textContent = "";

    } catch (error) {
        if (error instanceof Error) {
            userSearchError.textContent = error.message;
        }
    } finally {
        userSearchUsernameInput.disabled = false;
        userSearchStatus.textContent = "";
    }
}

function renderUserSearchResult(searchResult: UserSearchResponse) {
    userSearchResult.classList.remove("hidden");
    userSearchDisplayName.textContent = searchResult.user.displayName;
    userSearchUsername.textContent = searchResult.user.username;

    renderRelationshipAction(searchResult.relationshipState, searchResult.user.id, searchResult.connectionId);

    const actionButton = userSearchAction.querySelector("button") as HTMLButtonElement | null;
    actionButton?.focus();
}

function renderRelationshipAction(relationshipState: ConnectionRelationshipState, userId: number, connectionId: number| null) {
    userSearchAction.innerHTML = "";

    switch (relationshipState) {
        case "NONE": {
            renderConnectButton(userId);
            break;
        }
        case "OUTGOING_PENDING":
            userSearchAction.textContent = "Request sent";
            break;

        case "INCOMING_PENDING": {
            renderAcceptRejectButtons(userId, connectionId);
            break;
        }
        case "CONNECTED":
            userSearchAction.textContent = "Connected";
            break;

        case "REJECTED":
            renderConnectButton(userId);
            break;
    }
}

async function sendConnectionRequest(userId: number, connectButton: HTMLButtonElement) {
    userSearchError.textContent = "";

    try {
        connectButton.disabled = true;
        userSearchStatus.textContent = "Sending ...";

        await requestConnection(userId);
        renderRelationshipAction("OUTGOING_PENDING", userId, null);
        
        userSearchUsernameInput.focus();
    }
    catch(error){
        if (error instanceof Error) {
            userSearchError.textContent = error.message;
        }
        connectButton.disabled = false;
    } finally {
        userSearchStatus.textContent = "";
    }
}

async function acceptConnection(userId: number, connectionId: number, acceptButton: HTMLButtonElement, rejectButton: HTMLButtonElement) {
    userSearchError.textContent = "";

    try {
        acceptButton.disabled = true;
        rejectButton.disabled = true;
        userSearchStatus.textContent = "Accepting..";

        await acceptConnectionRequest(connectionId);
        renderRelationshipAction("CONNECTED", userId, null);

        userSearchUsernameInput.focus();
    } catch (error) {
        if(error instanceof Error) {
            userSearchError.textContent = error.message;
        }
        acceptButton.disabled = false;
        rejectButton.disabled = false;
    } finally {
        userSearchStatus.textContent = "";
    }
}

async function rejectConnection(userId: number, connectionId: number, acceptButton: HTMLButtonElement ,rejectButton: HTMLButtonElement) {
    userSearchError.textContent = "";

    try {
        acceptButton.disabled = true;
        rejectButton.disabled = true;
        userSearchStatus.textContent = "Rejecting...";

        await rejectConnectionRequest(connectionId);
        renderRelationshipAction("REJECTED", userId, null);

        userSearchUsernameInput.focus();
    } catch(error) {
        if(error instanceof Error) {
            userSearchError.textContent = error.message;
        }
        acceptButton.disabled = false;
        rejectButton.disabled = false;
    } finally {
        userSearchStatus.textContent = "";
    }
}

function renderConnectButton(userId: number) {
    const connectButton = document.createElement("button");
    connectButton.type = "button";
    connectButton.classList.add("user-search-action-button");
    connectButton.textContent = "Connect";
    userSearchAction.appendChild(connectButton);
    connectButton.addEventListener("click", () => {
        void sendConnectionRequest(userId, connectButton);
    });
}

function renderAcceptRejectButtons(userId: number, connectionId: number | null) {
    if (connectionId === null) {
        userSearchError.textContent = "Something went wrong. Please try again.";
        return;
    }
    const acceptButton = document.createElement("button");
    acceptButton.type = "button";
    acceptButton.classList.add(
        "user-search-action-button",
        "user-search-action-button--secondary"
    );
    acceptButton.textContent = "Accept";
    userSearchAction.appendChild(acceptButton);
    acceptButton.addEventListener('click', () => {
        void acceptConnection(userId, connectionId, acceptButton, rejectButton);
    })

    const rejectButton = document.createElement("button");
    rejectButton.type = "button";
    rejectButton.classList.add(
        "user-search-action-button",
        "user-search-action-button--secondary"
    );
    rejectButton.textContent = "Reject";
    userSearchAction.appendChild(rejectButton);
    rejectButton.addEventListener('click', () => {
        void rejectConnection(userId, connectionId, acceptButton, rejectButton);
    })
}

