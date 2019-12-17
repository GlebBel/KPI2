import {FindManyOptions, SelectQueryBuilder} from 'typeorm';
import {Pageable} from './interfaces';

export function getPageQueryBuilder<T>(qb: SelectQueryBuilder<T>, pageable: Pageable): SelectQueryBuilder<T> {
    return qb
        .offset(pageable.size * pageable.page)
        .limit(pageable.size);
}

export function getPageFindOptions<T>(options: FindManyOptions<T>, pageable: Pageable): FindManyOptions<T> {
    options.take = pageable.size;
    options.skip = pageable.size * pageable.page;
    return options;
}

export function wrapNullable<T>(field: T | null | undefined): any {
    if (field !== undefined) return field;
    else return field || undefined;
}
