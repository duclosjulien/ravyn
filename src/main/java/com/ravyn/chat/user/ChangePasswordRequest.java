package com.ravyn.chat.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest() {
    @NotBlank
    static String currentPassword;

    @NotBlank
    @Size(min = 8, max = 72)
    static String newPassword;

    @Override
    public String toString() {
        return "ChangePasswordRequest[REDACTED]";
    }
}
