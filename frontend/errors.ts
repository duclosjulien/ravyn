export type ErrorCode =
    | "CONVERSATION_NOT_FOUND"
    | "USER_NOT_FOUND"
    | "CONVERSATION_WITH_SELF"
    | "CORRUPTED_DATA"
    | "UNKNOWN_ERROR"
    | "INVALID_CREDENTIALS"
    | "USERNAME_TAKEN"
    | "ALREADY_AUTHENTICATED";

export class ApiError extends Error {
    readonly status: number;
    readonly errorCode: ErrorCode;

    constructor(status: number, errorCode: ErrorCode, message: string) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }
}
