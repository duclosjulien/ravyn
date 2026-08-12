import {loadConnections} from "./connections.js";

const conversationsTabButton = document.querySelector('#conversationsTabButton') as HTMLButtonElement;
const connectionsTabButton = document.querySelector('#connectionsTabButton') as HTMLButtonElement;
const conversationsView = document.querySelector('#conversationsView') as HTMLElement;
const connectionsView = document.querySelector('#connectionsView') as HTMLElement;

export function initializeSidebar() {
    conversationsTabButton.addEventListener('click', showConversationsView);
    connectionsTabButton.addEventListener('click', showConnectionsView);
}

function showConversationsView(): void {
    connectionsView.classList.add("hidden");
    conversationsView.classList.remove("hidden");

    conversationsTabButton.classList.add("sidebar-tab--active");
    connectionsTabButton.classList.remove("sidebar-tab--active");
}

async function showConnectionsView(): Promise<void> {
    conversationsView.classList.add("hidden");
    connectionsView.classList.remove("hidden");

    conversationsTabButton.classList.remove("sidebar-tab--active");
    connectionsTabButton.classList.add("sidebar-tab--active");

    try {
        connectionsTabButton.disabled = true;
        await loadConnections();
    } catch {
        // connections.ts already displayed the error
    } finally {
        connectionsTabButton.disabled = false;
    }
}
