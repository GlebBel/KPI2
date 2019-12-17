import * as Sentry from '@sentry/node';
import config from './Config';

Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.node_env
});

export function isInitSentry() {
    return ['dev', 'staging', 'prod'].includes(config.node_env);
}

export default Sentry;
