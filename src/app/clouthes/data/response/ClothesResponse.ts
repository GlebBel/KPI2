import {IsEnum, IsNumber, IsString} from 'class-validator';
import {ClothesType} from '../enams/ClothesType';
import {Column, Entity, PrimaryColumn} from 'typeorm';

interface ClothesResponseConstructionObject {
    id?: number | null | undefined;
    clothesType: ClothesType,
    name: string,
    price: number,
    discount: number,
    description: string,
}
@Entity({name: 'clothes'})

export class ClothesResponse {
    @IsNumber()
    id: number | null;

    @IsEnum(ClothesType)
    clothesType: ClothesType;

    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsNumber()
    discount: number;

    @IsString()
    description: string;

    public static fromObject(builder: ClothesResponseConstructionObject) {
        let newClothes = new ClothesResponse();
        newClothes.id = builder.id || null;
        newClothes.clothesType = builder.clothesType;
        newClothes.name = builder.name;
        newClothes.price = builder.price;
        newClothes.discount = builder.discount;
        newClothes.description = builder.description;
        return newClothes
    }

    public static filter(clothesArray: ClothesResponse[], options: {name?: string, type?: ClothesType}): ClothesResponse[] {
        return clothesArray.filter(clothes => {
            let elem: ClothesResponse | null = null;

            if (options.name) {
                if (clothes.name === options.name) elem = clothes;
                else
                    return null;
            }

            if (options.type) {
                if (clothes.clothesType === options.type) elem = clothes;
                else
                    return null;
            }

            return elem || null;
        })
    }
}
