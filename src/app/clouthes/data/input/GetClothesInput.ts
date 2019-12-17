import {IsEnum, IsNumber, IsString} from 'class-validator';
import {ClothesType} from '../enams/ClothesType';

export class GetClothesInput {
    @IsEnum(ClothesType)
    clothesType?: ClothesType;

    @IsString()
    name?: string;
}
