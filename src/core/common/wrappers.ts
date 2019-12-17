import {Forbidden} from '../exceptions/Forbidden';
import {NotFound} from '../exceptions/NotFound';

export class TryFind<T> {
    private readonly func: () => Promise<T | null>;

    public static of<T>(findingFunc: () => Promise<T | null>) {
        return new TryFind<T>(findingFunc);
    }

    public async getOrThrow(errorMessage: string = 'Not found'): Promise<T> {
        const res = await this.func();
        if (!res) throw new NotFound(errorMessage);
        return res;
    }

    public async handleResult<R>(handler: (T) => R): Promise<R> {
        const res = await this.func();
        return handler(res);
    }

    public async throwOnResult(error: Error): Promise<void> {
        const res = await this.func();
        if (res) throw error;
    }

    private constructor(findingFunc: () => Promise<T | null>) {
        this.func = findingFunc;
    }
}

export class CheckPermissions {
    private readonly func: () => boolean;

    public static of(checkFunc: () => boolean) {
        return new CheckPermissions(checkFunc);
    }

    public throwOnFailure(errorMessage: string = 'Action is not allowed'): void {
        if (!this.func()) throw new Forbidden(errorMessage);
    }

    private constructor(checkFunc: () => boolean) {
        this.func = checkFunc;
    }
}
