import {IsEnum, IsNumber, IsString} from 'class-validator';
import {ClothesType} from '../enams/ClothesType';

export class AddClothesInput {
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
}
