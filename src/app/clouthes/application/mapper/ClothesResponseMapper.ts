import {injectable} from 'inversify';
import {ClothesEntity} from '../../data/entities/ClothesEntity';
import {ClothesResponse} from '../../data/response/ClothesResponse';
import {Mapper} from '../../../../core/common/Mapper';

@injectable()
export class ClothesResponseMapper implements Mapper<ClothesEntity, ClothesResponse>{
    map(from: ClothesEntity): ClothesResponse {
        return ClothesResponse.fromObject({
            id: from.id,
            name: from.name,
            clothesType: from.clothesType,
            price: from.price,
            discount: from.discount,
            description: from.description
        })
    }
}
