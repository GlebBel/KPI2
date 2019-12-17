import Sentry, {isInitSentry} from '../../configuration/Sentry';
import logger from '../../configuration/Logger';

export function asyncErrorHandler<T>(handler: (...args: any) => Promise<T>): (...args: any) => Promise<T> {
    return async function (args: any): Promise<T> {
        try {
            return await handler(...arguments);
        } catch (e) {
            if (isInitSentry()) {
                Sentry.captureException(e);
            }
            logger.error(e);
            throw e;
        }
    };
}
