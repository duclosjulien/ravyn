import {changeDisplayName, getCurrentUserProfile} from "./api.js";
import {SelfProfileResponse} from "./types.js";
import {ApiError} from "./errors";

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
const settingsButton = document.querySelector('#settingsButton') as HTMLButtonElement;
const settingsModal = document.querySelector('#settingsModal') as HTMLElement;
const closeSettingsButton = document.querySelector('#closeSettingsButton') as HTMLButtonElement;
const displayNameError = document.querySelector('#displayNameError') as HTMLElement;
const currentUserAvatar = document.querySelector('#currentUserAvatar') as HTMLElement;
const dropdownUserAvatar = document.querySelector('#dropdownUserAvatar') as HTMLElement;

function toggleAccountMenu() {
    accountDropdownMenu.classList.toggle('hidden');
}

export function initializeAccountMenu(): void {
    accountMenuButton.addEventListener('click', toggleAccountMenu);
    editDisplayNameButton.addEventListener('click', editDisplayName);
    displayNameForm.addEventListener('submit', handleDisplayNameSubmit);
    cancelDisplayNameButton.addEventListener('click', handleDisplayNameCancel);
    settingsButton.addEventListener('click', showSettingsPanel);
    closeSettingsButton.addEventListener('click', hideSettingsPanel);
}

export async function loadAccountMenu(): Promise<void> {
    const profile = await getCurrentUserProfile();

    renderAccountMenuTrigger(profile);
    renderAccountDropdown(profile);
}

function renderAccountMenuTrigger(profile: SelfProfileResponse) {
    currentMenuDisplayName.textContent = profile.displayName;
    currentUserAvatar.textContent = getAvatarInitial(profile);
}

function renderAccountDropdown(profile: SelfProfileResponse) {
    dropdownDisplayName.textContent = profile.displayName;
    dropdownUsername.textContent = `@${profile.username}`;
    dropdownUserAvatar.textContent = getAvatarInitial(profile);
}

function getAvatarInitial(profile: SelfProfileResponse): string {
    return profile.displayName.trim().charAt(0).toUpperCase();
}

async function editDisplayName(): Promise<void> {
    const profile = await getCurrentUserProfile();
    displayNameInput.value = profile.displayName;

    displayNameError.textContent = "";
    showEditMode();
}

async function handleDisplayNameSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    try {
        await changeDisplayName(displayNameInput.value);
    }

    catch(error) {
        if(error instanceof ApiError){
            displayNameError.textContent = error.message;
        }
        else {
            displayNameError.textContent = "An unexpected error occurred.";
        }
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

function showSettingsPanel(): void {
    settingsModal.classList.remove('hidden');
    showViewMode();
    accountDropdownMenu.classList.add('hidden');
}

function hideSettingsPanel(): void {
    settingsModal.classList.add('hidden');
}

