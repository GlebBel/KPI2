export class FileStorageError extends Error {

    public message: string;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, FileStorageError.prototype);
    }

}
