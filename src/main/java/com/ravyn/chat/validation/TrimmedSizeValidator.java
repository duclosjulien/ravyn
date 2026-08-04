package com.ravyn.chat.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import static com.ravyn.chat.validation.TextNormalizer.stripBoundaryWhitespace;

public class TrimmedSizeValidator
        implements ConstraintValidator<TrimmedSize, String> {

    private int min;
    private int max;

    @Override
    public void initialize(TrimmedSize constraint) {
        this.min = constraint.min();
        this.max = constraint.max();
    }

    @Override
    public boolean isValid(
            String value,
            ConstraintValidatorContext context
    ) {
        if (value == null) {
            return true;
        }

        String trimmedValue = stripBoundaryWhitespace(value);
        int trimmedLength = trimmedValue.codePointCount(0, trimmedValue.length());

        return trimmedLength >= min && trimmedLength <= max;
    }
}