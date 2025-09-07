// lexererr.ts

// Abstract base class for lexer errors
export abstract class LexerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

// Specific error: ErrorToken
export class ErrorToken extends LexerError {
    constructor(s: string) {
        super(`Error Token: ${s}`);
    }
}

// Specific error: UncloseString
export class UncloseString extends LexerError {
    constructor(s: string) {
        super(`Unclosed String: ${s}`);
    }
}

// Specific error: IllegalEscape
export class IllegalEscape extends LexerError {
    constructor(s: string) {
        super(`Illegal Escape In String: ${s}`);
    }
}