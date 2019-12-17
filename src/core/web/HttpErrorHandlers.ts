import {ExpressErrorMiddlewareInterface, Middleware} from 'routing-controllers';
import * as express from 'express';
import {ValidationError} from 'class-validator';
import logger from '../../configuration/Logger';
import {ApiError, ApiResponse} from './data/ApiResponse';
import {injectable} from 'inversify';
import config from '../../configuration/Config';
import Sentry, {isInitSentry} from '../../configuration/Sentry';
import {ErrorRequestHandler} from 'express';
import {NotFound} from '../exceptions/NotFound';
import {Unauthorized} from '../exceptions/Unauthorized';
import {BadRequest} from '../exceptions/BadRequest';
import {Forbidden} from '../exceptions/Forbidden';

interface HandlerResult {
    errors: ApiError[];
    code: number;
}

interface ErrorHandler {
    handle(error: any, request: express.Request): HandlerResult;
}

class ValidationErrorHandler implements ErrorHandler {
    handle(error: any, request: express.Request): HandlerResult {
        logger.info(error, 'Validation error');
        return {
            errors: error
                .map(e => Object.values(e.constraints))
                .reduce((acc, el) => acc.concat(el), [])
                .map(m => new ApiError(m)),
            code: 400
        };
    }
}

class NotFoundErrorHandler implements ErrorHandler {
    handle(error: any, request: express.Request): HandlerResult {
        logger.info(error, 'Not found');
        return {
            errors: [new ApiError(error.message)],
            code: 404
        };
    }
}

class BadRequestErrorHandler implements ErrorHandler {
    handle(error: any, request: express.Request): HandlerResult {
        logger.info(error, 'Bad request');
        return {
            errors: [new ApiError(error.message)],
            code: 400
        };
    }
}

class UnauthorizedErrorHandler implements ErrorHandler {
    handle(error: any, request: express.Request): HandlerResult {
        logger.info(error, 'Unauthorized');
        return {
            errors: [new ApiError(error.message)],
            code: 401
        };
    }
}

class ForbiddenErrorHandler implements ErrorHandler {
    handle(error: any, request: express.Request): HandlerResult {
        logger.info(error, 'Forbidden');
        return {
            errors: [new ApiError(error.message)],
            code: 403
        };
    }
}

class UnhandledErrorHandler implements ErrorHandler {
    handle(error: any, request: express.Request) {
        logger.error(error, 'Unhandled exception');
        const defaultMessage = 'Something went wrong';
        let message = config.node_env === 'prod' ? defaultMessage : error.message;
        return {
            errors: [new ApiError(message)],
            code: 500
        };
    }
}

@injectable()
@Middleware({type: 'after', priority: 2})
export class SentryErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err?: any) => any): void {
        if (isInitSentry()) {
            const sentryErrorHandler = Sentry.Handlers.errorHandler() as ErrorRequestHandler;
            sentryErrorHandler(error, request, response, next);
        } else {
            next(error);
        }
    }
}

@injectable()
@Middleware({type: 'after', priority: 1})
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
    public error(error: any, request: express.Request, response: express.Response, next: express.NextFunction): void {
        const handler = this.getErrorHandler(error);
        let {code, errors} = handler.handle(error, request);
        response.status(code).json(new ApiResponse(null, errors));
        next();
    }

    private getErrorHandler(error: any): ErrorHandler {
        if (Array.isArray(error) && error.every((element) => element instanceof ValidationError)) {
            return new ValidationErrorHandler();
        } else if (error instanceof NotFound) {
            return new NotFoundErrorHandler();
        } else if (error instanceof Unauthorized) {
            return new UnauthorizedErrorHandler();
        } else if (error instanceof BadRequest) {
            return new BadRequestErrorHandler();
        } else if (error instanceof Forbidden) {
            return new ForbiddenErrorHandler();
        } else {
            return new UnhandledErrorHandler();
        }
    }
}
