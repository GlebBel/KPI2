import {ClothesType} from '../enams/ClothesType';
import {Entity} from 'typeorm/decorator/entity/Entity';
import {PrimaryColumn} from 'typeorm/decorator/columns/PrimaryColumn';
import {SQLBigIntToNumberValueTransformer} from '../../../../core/db/transformers';
import {Column} from 'typeorm/decorator/columns/Column';

interface ClothesEntityConstructionObject {
    id?: number | null | undefined;
    clothesType: ClothesType,
    name: string,
    price: number,
    discount: number,
    description: string,
}
@Entity({name: 'clothes'})
export class ClothesEntity {
    @PrimaryColumn({name: 'id', generated: true, transformer: new SQLBigIntToNumberValueTransformer()})
    id?: number;

    @Column({name: 'clothes_type', type: 'enum', enum: ClothesType})
    clothesType: ClothesType;

    @Column({name: 'name'})
    name: string;

    @Column({name: 'price'})
    price: number;

    @Column({name: 'discount'})
    discount: number;

    @Column({name: 'description'})
    description: string;

    public static fromObject(builder: ClothesEntityConstructionObject) {
        let newClothes = new ClothesEntity();
        newClothes.id = builder.id || undefined;
        newClothes.clothesType = builder.clothesType;
        newClothes.name = builder.name;
        newClothes.price = builder.price;
        newClothes.discount = builder.discount;
        newClothes.description = builder.description;
    }
}
