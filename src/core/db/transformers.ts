import {ValueTransformer} from 'typeorm';

export class SQLBigIntToNumberValueTransformer implements ValueTransformer {
    from(value: any): any {
        return parseInt(value, 10);
    }

    to(value: any): any {
        return value;
    }
}
