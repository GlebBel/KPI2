import * as express from 'express';
import * as swaggerUI from 'swagger-ui-express';
import {getMetadataArgsStorage, RoutingControllersOptions} from 'routing-controllers';
import {routingControllersToSpec} from 'routing-controllers-openapi';
import {validationMetadatasToSchemas} from 'class-validator-jsonschema';
import {getFromContainer, MetadataStorage} from 'class-validator';
import config from './Config';
import * as basicAuth from 'express-basic-auth';

function classValidatorSchemaToJsonSchema() {
    const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas;
    return validationMetadatasToSchemas(metadatas, {
        refPointerPrefix: '#/components/schemas'
    });
}

function generateOpenAPISpec(routingControllersOptions: RoutingControllersOptions) {
    const schemas = classValidatorSchemaToJsonSchema();
    const storage = getMetadataArgsStorage();
    return routingControllersToSpec(storage, routingControllersOptions, {
        components: {
            schemas
        },
        info: {
            description: 'API description',
            title: 'Egg API',
            version: '1.0.0'
        }
    });
}

export function addSwaggerDocEndpoint(router: express.Router, routingControllersOptions: RoutingControllersOptions) {
    const spec = generateOpenAPISpec(routingControllersOptions);
    router.use(
        '/docs',
        swaggerUI.serve,
        basicAuth({
            users: {
                [config.docs.auth.user]: config.docs.auth.password
            },
            challenge: true
        }),
        swaggerUI.setup(spec)
    );
}

