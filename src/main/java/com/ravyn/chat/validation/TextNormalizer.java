package com.ravyn.chat.validation;

import java.util.regex.Pattern;

public final class TextNormalizer {
    private TextNormalizer() {}

    private static final Pattern BOUNDARY_WHITESPACE =
            Pattern.compile("^[ \\t\\n\\r\\f\\x0B]+|[ \\t\\n\\r\\f\\x0B]+$");

    public static String stripBoundaryWhitespace(String value) {
        return BOUNDARY_WHITESPACE.matcher(value).replaceAll("");
    }
}
