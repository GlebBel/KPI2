import {EntityManager, getManager, Repository} from 'typeorm';
import {getNamespace} from 'cls-hooked';
import config from '../../configuration/Config';
import {injectable, unmanaged} from 'inversify';

@injectable()
export class BaseTypeORMRepository<T> {
    protected entity: new() => T;

    constructor(@unmanaged() entity: new() => T) {
        this.entity = entity;
    }

    protected get entityManager(): EntityManager {

        let context = getNamespace(config.cls.contextName);

        if (context && context.active) {

            let transactionalEntityManager = context.get(config.cls.transactionManagerKey);

            if (transactionalEntityManager) return transactionalEntityManager;
            else return getManager();
        }
        return getManager();
    }

    protected get repository(): Repository<T> {
        return this.entityManager.getRepository<T>(this.entity);
    }

}
