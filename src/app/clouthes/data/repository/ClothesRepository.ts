import {injectable} from 'inversify';
import {ClothesEntity} from '../entities/ClothesEntity';
import {BaseTypeORMRepository} from '../../../../core/db/BaseTypeORMRepository';
import {async} from 'q';
import {ClothesType} from '../enams/ClothesType';

@injectable()
export class ClothesRepository extends BaseTypeORMRepository<ClothesEntity> {
    constructor() {
        super(ClothesEntity)
    }

    public async save(clothes: ClothesEntity): Promise<ClothesEntity> {
        return await this.repository.save(clothes);
    }

    public async findById(clothesId: number): Promise<ClothesEntity | null> {
        const maybeClothes = await this.repository.findOne({where: {id: clothesId}});
        return maybeClothes || null
    }

    public async findByNameAndType(name?: string, type?: ClothesType): Promise<ClothesEntity[]> {
        let qb = this.repository.createQueryBuilder('clothes');

        if (name) {
            qb.andWhere('clothes.name = :name', {name})
        }

        if (type) {
            qb.andWhere('clothes.clothesType = :type', {type})
        }

        return await qb.cache(true).getMany();

    }

    public async getAll(): Promise<ClothesEntity[]> {
        const maybeClothes = await this.repository.find();
        return maybeClothes
    }

    public async delete(clothesId: number) {
        await this.repository.delete({id: clothesId})
    }
}
