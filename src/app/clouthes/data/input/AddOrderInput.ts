import {IsEnum, IsNumber, IsString} from 'class-validator';
import {ClothesType} from '../enams/ClothesType';

export class AddOrderInput {
    @IsNumber()
    clothesId: number;

    @IsString()
    name: string;

    @IsString()
    address: string;
}
