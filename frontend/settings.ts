import {changePassword} from "./api.js";
import {ApiError} from "./errors.js";

const changePasswordButton = document.querySelector('#changePasswordButton') as HTMLButtonElement;
const changePasswordModal = document.querySelector('#passwordModal') as HTMLElement;
const changePasswordForm = document.querySelector('#changePasswordForm') as HTMLFormElement;
const changePasswordFormCancelButton = document.querySelector('#cancelPasswordButton') as HTMLButtonElement;
const currentPasswordInput = document.querySelector('#currentPassword') as HTMLInputElement;
const newPasswordInput = document.querySelector('#newPassword') as HTMLInputElement;
const passwordErrorBox = document.querySelector('#passwordError') as HTMLElement;
const changePasswordSubmitButton =
    changePasswordForm.querySelector('button[type="submit"]') as HTMLButtonElement;

let isPasswordChangePending = false;
let previouslyFocusedElement: HTMLElement | null = null;

export function initializeSettingsMenu() {
    changePasswordButton.addEventListener('click', showPasswordChangePanel);
    changePasswordForm.addEventListener('submit', handlePasswordSubmit);
    changePasswordFormCancelButton.addEventListener('click', hidePasswordChangePanel);
    changePasswordModal.addEventListener('keydown', trapPasswordModalFocus);
}

function showPasswordChangePanel() {
    previouslyFocusedElement =
        document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;

    changePasswordModal.classList.remove('hidden');
    currentPasswordInput.focus();
}

function hidePasswordChangePanel() {
    if (isPasswordChangePending) {
        return;
    }

    changePasswordModal.classList.add("hidden");
    changePasswordForm.reset();
    passwordErrorBox.textContent = "";

    previouslyFocusedElement?.focus();
    previouslyFocusedElement = null;
}

async function handlePasswordSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    if (isPasswordChangePending) return;

    isPasswordChangePending = true;
    changePasswordSubmitButton.disabled = true;
    changePasswordFormCancelButton.disabled = true;
    passwordErrorBox.textContent = "";

    let passwordChanged = false;

    try {
        await changePassword(
            currentPasswordInput.value,
            newPasswordInput.value
        );

        passwordChanged = true;
    } catch (error) {
        passwordErrorBox.textContent =
            error instanceof ApiError
                ? error.message
                : "An unexpected error occurred.";
    } finally {
        isPasswordChangePending = false;
        changePasswordSubmitButton.disabled = false;
        changePasswordFormCancelButton.disabled = false;
    }

    if (passwordChanged) {
        hidePasswordChangePanel();
    }
}

function trapPasswordModalFocus(event: KeyboardEvent): void {
    if (event.key !== "Tab") return;

    const focusableElements =
        changePasswordModal.querySelectorAll<HTMLElement>(
            'input, button:not([disabled])'
        );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) return;

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
}




