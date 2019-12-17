import {Level} from 'pino';
import * as DotEnv from 'dotenv';
import {DotenvConfigOptions} from 'dotenv';
import * as assert from 'assert';

export const ALLOWED_NODE_ENV = ['local', 'dev', 'staging', 'prod', 'test', 'ci'];

export interface ConfigInterface {
    port: number;
    docs: {
        auth: {
            user: string;
            password: string;
        }
    };
    cls: {
        contextName: string;
        transactionManagerKey: string;
    };
    auth: {
        codeLength: number;
        codeExpirationTime: number;
        accessTokenLifetime: number;
        refreshTokenLifetime: number;
    };
    aws: {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
    };
    fileStorage: {
        bucketName: string,
        avatarMaxSize: number
    };
    sentry: {
        dsn: string;
    };
    typeorm: {
        cacheDuration: number
    };
    apiPrefix: string;
    node_env: string;
    logger: {
        level: Level;
    };
    twilio: {
        accountId: string;
        authToken: string;
        phoneNumber: string;
    };
    firebase: {
        authJson: any;
        projectId: string;
        maxTokensPerRequest: number;
    };
    controllerPaths: string[];
    middlewarePaths: string[];
    diContainerModulesPath: string[];
    devMode: {
        smsVerification: boolean;
    };
    host: string;

}

function configuration(): ConfigInterface {
    const nodeEnv = process.env.NODE_ENV || 'local';
    assert(ALLOWED_NODE_ENV.indexOf(nodeEnv) > -1);
    const path = `env/.env.${nodeEnv}`;
    const dotEnvOptions: DotenvConfigOptions = {
        path: path
    };
    DotEnv.config(dotEnvOptions);
    return {
        port: parseInt(process.env.PORT || '8080', 10),
        docs: {
            auth: {
                user: process.env.DOCS_USER || '',
                password: process.env.DOCS_PASSWORD || ''
            }
        },
        cls: {
            contextName: '__cls__context',
            transactionManagerKey: '__typeOrm__transactionalEntityManager'
        },
        auth: {
            codeLength: 4,
            codeExpirationTime: 60 * 10 , // 10 min
            accessTokenLifetime: 30 * 24 * 60 * 60, // 1 month
            refreshTokenLifetime: 12 * 30 * 24 * 60 * 60 // 1 year
        },
        sentry: {
            dsn: process.env.SENTRY_DSN || ''
        },
        typeorm: {
            cacheDuration: 1000 // 1s
        },
        twilio: {
            accountId: process.env.TWILIO_ACCOUNT_ID || '',
            authToken: process.env.TWILIO_AUTH_TOKEN || '',
            phoneNumber: process.env.TWILIO_PHONE_NUMBER || ''
        },
        firebase: {
            authJson: process.env.FIREBASE_AUTH_JSON ? JSON.parse(process.env.FIREBASE_AUTH_JSON) : '', // tslint:disable-line
            projectId: process.env.FIREBASE_PROJECT_ID || '',
            maxTokensPerRequest: 1000
        },
        aws: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            region: process.env.AWS_REGION || ''
        },
        fileStorage: {
            bucketName: process.env.S3_BUCKET_NAME || '',
            avatarMaxSize: 1024 * 1024 * 10
        },
        apiPrefix: '/api',
        node_env: process.env.NODE_ENV || 'local',
        logger: {
            level: process.env.NODE_ENV === 'local' ? 'debug' : 'info'
        },
        controllerPaths: [__dirname + '/../app/**/web/*Controller.js'],
        middlewarePaths: [__dirname + '/../core/web/HttpErrorHandlers.js'],
        diContainerModulesPath: [
            __dirname + '/../app/**/*ContainerModule.js',
            __dirname + '/../core/**/*ContainerModule.js'
        ],
        devMode: {
            smsVerification: ['local', 'dev'].includes(nodeEnv)
        },
        host: process.env.HOST || 'http://localhost:8080',
    };
}

const config = configuration();

export default config;
