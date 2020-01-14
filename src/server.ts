import appInitializer from './AppInitializer';
import config from './configuration/Config';
import logger from './configuration/Logger';
import {initSocket} from './core/socket/WebSocketsInit';

var https = require('https');
var http = require('http');

https.globalAgent.maxSockets = 5;
http.globalAgent.maxSockets = 5;

class Server {

    private server: any;
    private readonly port: number;
    public socket: any;

    public constructor() {
        this.port = config.port;
    }

    public async runServer(): Promise<void> {
        try {
            const app = await appInitializer.initialize();
            this.server = app.listen(this.port);
            this.socket = initSocket(this.server);
            this.server.on('listening', () => {
                let address = this.server.address();
                logger.info(`Listening on port ${address.port}`);
            });

            this.server.on('error', (error: Error) => {
                logger.error('Server start error: ', error);
                process.exit(1);
            });
        } catch (error) {
            logger.error(error);
            // TODO: Graceful shutdown
        }
    }
}

export default new Server().runServer();
