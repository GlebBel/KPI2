import {ClothesInteractionServices} from '../application/services/ClothesInteractionServices';
import {inject, injectable} from 'inversify';
import {Body, JsonController, QueryParams} from 'routing-controllers';
import {ClothesResponse} from '../data/response/ClothesResponse';
import {ApiDocs} from '../../../configuration/docs/decorators';
import {Post} from 'routing-controllers/decorator/Post';
import {AddClothesInput} from '../data/input/AddClothesInput';
import {ApiResponse} from '../../../core/web/data/ApiResponse';
import {validateOrReject} from 'class-validator';
import {Get} from 'routing-controllers/decorator/Get';
import {GetClothesInput} from '../data/input/GetClothesInput';

@injectable()
@JsonController('/clothes')
export class ClothesController {
    private clothesInteractionServices: ClothesInteractionServices;

    constructor(
        @inject(ClothesInteractionServices) clothesInteractionServices: ClothesInteractionServices
    ){
        this.clothesInteractionServices = clothesInteractionServices
    }

    @ApiDocs({
        operationObject: {summary: 'Add new clothes'},
        responseClass: ClothesResponse,
        responses: [{code: 200}]
    })
    @Post()
    public async addClothes(
        @Body() input: AddClothesInput
    ): Promise<ApiResponse<ClothesResponse>> {
        await validateOrReject(input);
        const clothes = await this.clothesInteractionServices.addClothes(input);
        return new ApiResponse(clothes, []);
    }

    @ApiDocs({
        operationObject: {summary: 'Get all clothes'},
        responseClass: ClothesResponse,
        responses: [{code: 200}]
    })
    @Get('/all')
    public async getAll(
    ): Promise<ApiResponse<ClothesResponse[]>> {
        const clothes = await this.clothesInteractionServices.getAll();
        return new ApiResponse(clothes, []);
    }

    @ApiDocs({
        operationObject: {summary: 'Get clothes with filters'},
        responseClass: ClothesResponse,
        responses: [{code: 200}]
    })
    @Get('/')
    public async getClothes(
        @QueryParams() input: GetClothesInput
    ): Promise<ApiResponse<ClothesResponse[]>> {
        const clothes = await this.clothesInteractionServices.find(input.name, input.clothesType);
        return new ApiResponse(clothes, []);
    }

}
