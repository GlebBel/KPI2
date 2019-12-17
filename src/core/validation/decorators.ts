import {Transform} from 'class-transformer';

export function TransformToArray(target: any, key: string) {
    Transform(value => Array.isArray(value) ? value : [value])(target, key);
}

export function TransformToDate(target: any, key: string) {
    Transform(value => value ? new Date(value) : null)(target, key);
}

export function TransformToEnum(enumEntity: Object) {
    return (target: any, key: string) => {
        Transform(value => value ? enumEntity[value] : null)(target, key);
    };
}
