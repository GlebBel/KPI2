export class TwilioError extends Error {

    public code: number;
    public message: string;

    constructor(code: number, message: string) {
        super(`Twilio Error! Code: ${code}; Error message: ${message}`);
        Object.setPrototypeOf(this, TwilioError.prototype);
        this.code = code;
        this.message = message;
    }

}
