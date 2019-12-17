export class ApiError {
    public message: string;

    constructor(message: string) {
        this.message = message;
    }
}

export class ApiResponse<T> {
    public data: T;
    public errors: ApiError[];

    constructor(data: T, errors: ApiError[]) {
        this.data = data;
        this.errors = errors;
    }
}
