import {ContainerModule, interfaces} from 'inversify';
import {HttpErrorHandler, SentryErrorHandler} from './HttpErrorHandlers';

export default new ContainerModule((
    bind: interfaces.Bind,
    unbind: interfaces.Unbind,
    isBound: interfaces.IsBound,
    rebind: interfaces.Rebind
) => {
    bind(HttpErrorHandler).toSelf();
    bind(SentryErrorHandler).toSelf();
});
