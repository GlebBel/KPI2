import * as express from 'express';
import {Container} from 'inversify';
import * as ExpressPinoLogger from 'express-pino-logger';
import * as bodyParser from 'body-parser';

import config from './configuration/Config';
import logger from './configuration/Logger';
import {addSwaggerDocEndpoint} from './configuration/Swagger';
import {
    Action,
    RoutingControllersOptions,
    useContainer as useContainerRoutingController,
    useExpressServer
} from 'routing-controllers';
import {createDIContainer} from './configuration/DIContainer';
import {createConnectionPool} from './configuration/Postgres';
import Sentry, {isInitSentry} from './configuration/Sentry';
import {clsContext} from './configuration/CLS';
import {registerEventListeners} from './core/common/events';
import {initSocket} from './core/socket/WebSocketsInit';

class AppInitializer {
    public app: express.Application;
    public router: express.Router;
    public diContainer: Container;
    public routingControllerOptions: RoutingControllersOptions;

    public async initialize(): Promise<express.Application> {

        this.app = express();

        this.initHttpLogging();

        this.initContainer();

        this.initMiddleware();

        this.initDatabase();

        this.initRoutes();

        this.initEventListeners();

        if (config.node_env !== 'prod') {
            this.initSwagger();
        }

        return this.app;
    }

    private async initDatabase(): Promise<void> {
        await createConnectionPool();
    }


    private initMiddleware(): void {
        this.app.disable('x-powered-by');
        this.app.use(bodyParser.urlencoded({'extended': true}));
        this.app.use(bodyParser.json());
        this.app.use((req, res, next) => {
            clsContext.bindEmitter(req);
            clsContext.bindEmitter(res);
            clsContext.run(() => next());
        });
        if (isInitSentry()) {
            this.app.use(Sentry.Handlers.requestHandler());
        }
    }


    private initRoutes(): void {
        this.router = express.Router();
        this.routingControllerOptions = {
            controllers: config.controllerPaths,
            middlewares: config.middlewarePaths,
            routePrefix: config.apiPrefix,
            defaultErrorHandler: false,
            validation: true,
        };
        useContainerRoutingController(this.diContainer);
        useExpressServer(this.app, this.routingControllerOptions);
        this.app.use(this.router);
    }

    private initContainer(): void {
        this.diContainer = createDIContainer(config.diContainerModulesPath);
    }

    private initHttpLogging() {
        this.app.use(ExpressPinoLogger({
            logger: logger
        }));
    }

    private initSwagger() {
        addSwaggerDocEndpoint(this.router, this.routingControllerOptions);
    }

    private initEventListeners() {
        registerEventListeners(this.diContainer);
    }

    private initSockets() {
        initSocket(this.diContainer)
    }
}

export default new AppInitializer();
