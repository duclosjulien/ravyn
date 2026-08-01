const accountMenuButton = document.querySelector('#accountMenuButton') as HTMLButtonElement;
const accountDropdownMenu = document.querySelector('#accountDropdown') as HTMLElement;
const currentMenuDisplayName = document.querySelector('#currentUserDisplayName') as HTMLElement;
const dropdownDisplayName = document.querySelector('#dropdownDisplayName') as HTMLElement;
const dropdownUsername = document.querySelector('#dropdownUsername') as HTMLElement;
const editDisplayNameButton = document.querySelector('#editDisplayNameButton') as HTMLButtonElement;
const displayNameInput = document.querySelector('#displayNameInput') as HTMLInputElement;
const displayNameForm = document.querySelector('#displayNameForm') as HTMLFormElement;
const cancelDisplayNameButton = document.querySelector('#cancelDisplayNameButton') as HTMLButtonElement;
const displayNameView = document.querySelector('#displayNameView') as HTMLElement;

import {changeDisplayName, getCurrentUserProfile} from "./api.js";
import {SelfProfileResponse} from "./types.js";


function toggleAccountMenu() {
    accountDropdownMenu.classList.toggle('hidden');
}

export function initializeAccountMenu(): void {
    accountMenuButton.addEventListener('click', toggleAccountMenu);
    editDisplayNameButton.addEventListener('click', editDisplayName);
    displayNameForm.addEventListener('submit', handleDisplayNameSubmit);
    cancelDisplayNameButton.addEventListener('click', handleDisplayNameCancel);
}

export async function loadAccountMenu(): Promise<void> {
    const profile = await getCurrentUserProfile();

    renderAccountMenuTrigger(profile);
    renderAccountDropdown(profile);
}

function renderAccountMenuTrigger(profile: SelfProfileResponse) {
    currentMenuDisplayName.textContent = profile.displayName
}

function renderAccountDropdown(profile: SelfProfileResponse) {
    dropdownDisplayName.textContent = profile.displayName;
    dropdownUsername.textContent = "@" + profile.username;
}

async function editDisplayName() {
    const profile = await getCurrentUserProfile();
    displayNameInput.value = profile.displayName;

    showEditMode();
}

async function handleDisplayNameSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    try {
        await changeDisplayName(displayNameInput.value);
    }

    catch(error) {
        console.log(error);
        // add error text box and display error message
        return;
    }
    await loadAccountMenu();
    showViewMode();
}

function handleDisplayNameCancel() {
    displayNameInput.value = "";
    showViewMode();
}

function showEditMode(): void {
    displayNameView.classList.add('hidden');
    displayNameForm.classList.remove('hidden');
    displayNameInput.focus();
}

function showViewMode(): void {
    displayNameForm.classList.add('hidden');
    displayNameView.classList.remove('hidden');
}

