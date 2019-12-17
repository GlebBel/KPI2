import {inject, injectable} from 'inversify';
import {ClothesRepository} from '../../data/repository/ClothesRepository';
import {Transaction} from '../../../../core/db/Transaction';
import {AddClothesInput} from '../../data/input/AddClothesInput';
import {ClothesResponse} from '../../data/response/ClothesResponse';
import {Mapper} from '../../../../core/common/Mapper';
import {ClothesEntity} from '../../data/entities/ClothesEntity';
import {ClothesResponseMapper} from '../mapper/ClothesResponseMapper';
import {FirstSourcesRepository} from '../../data/repository/FirstSourcesRepository';
import {SecondSourcesRepisitory} from '../../data/repository/SecondSourcesRepisitory';
import {ClothesType} from '../../data/enams/ClothesType';

@injectable()
export class ClothesInteractionServices {
    private clothesRepo: ClothesRepository;
    private clothesResponseMapper: Mapper<ClothesEntity, ClothesResponse>;
    private firstSourceRepo: FirstSourcesRepository;
    private secondSourceRepo: SecondSourcesRepisitory;

    constructor(
        @inject(ClothesRepository) clothesRepo: ClothesRepository,
        @inject(ClothesResponseMapper) clothesResponseMapper: Mapper<ClothesEntity, ClothesResponse>,
        @inject(FirstSourcesRepository) firstSourceRepo: FirstSourcesRepository,
        @inject(SecondSourcesRepisitory) secondSourceRepo: SecondSourcesRepisitory,
    ){
        this.clothesRepo = clothesRepo;
        this.clothesResponseMapper = clothesResponseMapper;
        this.firstSourceRepo = firstSourceRepo;
        this.secondSourceRepo = secondSourceRepo;
    }

    @Transaction()
    public async addClothes(input: AddClothesInput): Promise<ClothesResponse> {
        const newClothes = await this.clothesRepo.save(input);
        return this.clothesResponseMapper.map(newClothes)
    }

    @Transaction()
    public async getAll(): Promise<ClothesResponse[]> {
        const localSource = await this.clothesRepo.getAll();
        const localSourceResp = await localSource.map(e => this.clothesResponseMapper.map(e));
        const firstSourcesClothes = await this.firstSourceRepo.getAllClothes();
        const secondSourcesClothes = await this.secondSourceRepo.getAllClothes();
        const fullResponse = firstSourcesClothes.concat(secondSourcesClothes, localSourceResp);
        return fullResponse;
    }

    @Transaction()
    public async find(name?: string, type?: ClothesType): Promise<ClothesResponse[]> {

        const localSource = await this.clothesRepo.findByNameAndType(name, type);
        const localSourceResp = await localSource.map(e => this.clothesResponseMapper.map(e));

        // const firstSourcesClothes = await this.firstSourceRepo.getAllClothes();
        const secondSourcesClothes = await this.secondSourceRepo.getAllClothes();
        const fullResponse = ClothesResponse.filter(secondSourcesClothes, {name, type})
            .concat(localSourceResp);


        return fullResponse;
    }
}
