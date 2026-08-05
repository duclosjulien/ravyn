package com.ravyn.chat.user;

import com.ravyn.chat.validation.TrimmedSize;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank
        @TrimmedSize(min = 2, max = 50)
        String displayName) {
}
