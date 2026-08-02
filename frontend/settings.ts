import {changePassword} from "./api.js";
import {ApiError} from "./errors.js";

const changePasswordButton = document.querySelector('#changePasswordButton') as HTMLButtonElement;
const changePasswordModal = document.querySelector('#passwordModal') as HTMLElement;
const changePasswordForm = document.querySelector('#changePasswordForm') as HTMLFormElement;
const changePasswordFormCancelButton = document.querySelector('#cancelPasswordButton') as HTMLButtonElement;
const currentPasswordInput = document.querySelector('#currentPassword') as HTMLInputElement;
const newPasswordInput = document.querySelector('#newPassword') as HTMLInputElement;
const passwordErrorBox = document.querySelector('#passwordError') as HTMLElement;

export function initializeSettingsMenu() {
    changePasswordButton.addEventListener('click', showPasswordChangePanel);
    changePasswordForm.addEventListener('submit', handlePasswordSubmit);
    changePasswordFormCancelButton.addEventListener('click', hidePasswordChangePanel);
}

function showPasswordChangePanel() {
    changePasswordModal.classList.remove('hidden');
}

function hidePasswordChangePanel() {
    changePasswordModal.classList.add('hidden');
    changePasswordForm.reset();
    passwordErrorBox.textContent = "";
}

async function handlePasswordSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    try {
        await changePassword(currentPasswordInput.value, newPasswordInput.value);
        hidePasswordChangePanel();
    } catch(error) {
        if(error instanceof  ApiError) {
            passwordErrorBox.textContent = error.message;
        }
        else {
            passwordErrorBox.textContent = "An unexpected error occurred.";
        }
        return;
    }
}



