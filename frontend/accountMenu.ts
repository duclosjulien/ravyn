const accountMenuButton = document.querySelector('#accountMenuButton') as HTMLButtonElement;
const accountDropdownMenu = document.querySelector('#accountDropdown') as HTMLElement;
const currentMenuDisplayName = document.querySelector('#currentUserDisplayName') as HTMLElement;
const dropdownDisplayName = document.querySelector('#dropdownDisplayName') as HTMLElement;
const dropdownUsername = document.querySelector('#dropdownUsername') as HTMLElement;

import {getCurrentUserProfile} from "./api.js";
import {SelfProfile} from "./types.js";


function toggleAccountMenu() {
    accountDropdownMenu.classList.toggle('hidden');
}

export function initializeAccountMenu(): void {
    accountMenuButton.addEventListener('click', toggleAccountMenu);
}

export async function loadAccountMenu(): Promise<void> {
    const profile = await getCurrentUserProfile();

    renderAccountMenuTrigger(profile);
    renderAccountDropdown(profile);
}

function renderAccountMenuTrigger(profile: SelfProfile) {
    currentMenuDisplayName.textContent = profile.displayName
}

function renderAccountDropdown(profile: SelfProfile) {
    dropdownDisplayName.textContent = profile.displayName;
    dropdownUsername.textContent = profile.username;
}

