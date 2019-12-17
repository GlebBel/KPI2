import {getMetadataArgsStorage} from 'routing-controllers';
import {OperationObject, ReferenceObject, SchemaObject} from 'openapi3-ts';
import {getContentType, IRoute, OpenAPI} from 'routing-controllers-openapi';
import {mergeDeepRight} from 'ramda';

export interface DocsResponse {
    code: number;
    description?: string;
}

interface InputOptions {
    contentType?: string;
}

export interface ResponseOptions extends InputOptions {
    isArray?: boolean;
    parseFiles?: boolean;
}

export interface DocsInput {
    operationObject: Partial<OperationObject>;
    inputClass?: Function;
    responseClass?: Function | string | null;
    responses?: DocsResponse[];
    inputOptions?: InputOptions;
    responseOptions?: ResponseOptions;
}

function createSchema(
    operationObject: Partial<OperationObject>,
    inputOptions: InputOptions,
    responseOptions: ResponseOptions,
    responses: DocsResponse[],
    inputClass?: Function,
    responseClass?: Function | string | null
) {
    return (source: OperationObject, route: IRoute) => {
        let {contentType, parseFiles, isArray} = responseOptions;
        contentType = contentType || getContentType(route);
        isArray = isArray || false;

        if (parseFiles)
            source = addFileParameters(source);

        if (inputClass)
            source = addInputSchema(source, inputOptions, inputClass);

        if (responseClass || responseClass === null)
            source = addResponseSchema(source, responses, responseClass, contentType, isArray);

        return addPartialObject(source, operationObject);
    };
}

export function ApiDocs({operationObject, inputClass, inputOptions, responseClass, responses, responseOptions}: DocsInput) {
    responses = responses || [];
    inputOptions = inputOptions || {contentType: 'application/json'};

    if (responses.some(e => e.code < 100 || e.code > 526)) throw new Error('Unacceptable HTTP code');

    return OpenAPI(createSchema(
        operationObject,
        inputOptions,
        responseOptions || {},
        responses,
        inputClass,
        responseClass
    ));
}

function addFileParameters(source: OperationObject): OperationObject {
    const [, methodName] = (source.operationId as string).split('.');
    let metadata = getMetadataArgsStorage();
    const checkParamMethod = param => methodName ? param.method === methodName : true;
    const files = metadata.params.filter(param => param.type === 'file' && checkParamMethod(param));
    const apiObjects = files.map(f => ({
        'in': 'formData',
        'name': f.name,
        'required': true,
        'consumes': 'multipart/form-data',
        'schema': {
            'type': f.type
        }
    }));
    return mergeDeepRight(source, {
        'parameters': apiObjects
    });
}

function addPartialObject(source: OperationObject, operationObject: Partial<OperationObject>) {
    return mergeDeepRight(source, operationObject);
}

function addInputSchema(source: OperationObject, inputOptions: InputOptions, inputClass: Function) {
    return mergeDeepRight(source, {
        requestBody: {
            content: {
                [inputOptions!!.contentType!]: {
                    schema: getRef(inputClass.name)
                }
            }
        }
    });
}

function addResponseSchema(
    source: OperationObject,
    errors: DocsResponse[],
    responseClass: Function | string | null,
    contentType: string,
    isArray: boolean
): OperationObject {
    let schema: SchemaObject;
    if (responseClass === null || responseClass instanceof Function) {
        let responseSchemaName = (responseClass && responseClass.name) || null;
        let reference: ReferenceObject;
        if (responseSchemaName) {
            reference = getRef(responseSchemaName);
            schema = isArray
                ? {items: reference, type: 'array'}
                : reference;
        } else {
            schema = {
                type: 'object',
                example: null
            };
        }
    } else {
        schema = {
            type: responseClass
        };
        if (isArray) {
            schema = {items: schema, type: 'array'};
        }
    }
    return errors.reduce((a, e) => mergeDeepRight(a, generateDocModel(e, schema, contentType)), source);
}

function generateDocModel(e: DocsResponse, schema: SchemaObject, contentType: string) {
    let errorsExample, data;
    if (e.code >= 200 && e.code < 300) {
        errorsExample = {example: []};
        data = schema;
    } else {
        errorsExample = {};
        data = {
            type: 'object',
            example: null
        };
    }
    const errors = {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                message: {
                    type: 'string'
                }
            }
        },
        ...errorsExample
    };
    const content = {
        [contentType]: {
            schema: {
                type: 'object',
                properties: {
                    data,
                    errors
                }
            }
        }
    };
    return {
        responses: {
            [e.code]: {
                content,
                description: e.description
            }
        }
    };
}

function getRef(className) {
    return {$ref: `#/components/schemas/${className}`};
}
