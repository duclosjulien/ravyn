package com.ravyn.chat.user;

import com.ravyn.chat.validation.TrimmedSize;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    @TrimmedSize(min = 2, max = 20)
    private String username;

    @NotBlank
    @Size(min = 8, max = 72)
    private String password;
}
