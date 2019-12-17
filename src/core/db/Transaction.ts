import {getConnection} from 'typeorm';
import {getNamespace} from 'cls-hooked';
import config from '../../configuration/Config';


export function Transaction(connectionName: string = 'default') {
    return function (target: Object, methodName: string, descriptor: PropertyDescriptor) {
        if (['test', 'ci'].includes(config.node_env)) return;

        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {

            let context = getNamespace(config.cls.contextName);

            if (!context) {
                // This will happen if no CLS namespace has been initialied in your app.
                throw new Error('No CLS namespace defined in your app ... Cannot use CLS transaction management.');
            }

            if (!context.active) {
                // This will happen if your code has not been executed using the run(...) function of your CLS namespace.
                throw new Error('No CLS active context detected ... Cannot use CLS transaction management.');
            }

            let transactionalEntityManager = context.get(config.cls.transactionManagerKey);

            if (!transactionalEntityManager) {
                return await getConnection(connectionName).transaction(async entityManager => {


                    context.set(config.cls.transactionManagerKey, entityManager);

                    let result = await originalMethod.apply(this, [...args]);

                    context.set(config.cls.transactionManagerKey, null);

                    return result;

                });
            } else {

                return await originalMethod.apply(this, [...args]);
            }

        };

    };
}
