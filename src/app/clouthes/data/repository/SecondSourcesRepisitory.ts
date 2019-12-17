import {injectable} from 'inversify';
import {ClothesType} from '../enams/ClothesType';
import {ClothesResponse} from '../response/ClothesResponse';
const axios = require('axios');

@injectable()
export class SecondSourcesRepisitory {

    public async getAllClothes(): Promise<ClothesResponse[]> {
        const clothesIds = await this.getAllClothesId();
        const clothes = Promise.all(await clothesIds.map(e => {
            return this.getClothesById(e.id);
        }));
        return clothes
    }

    private async getAllClothesId(): Promise<any[]> {
        const response = await axios.get(`http://localhost:8083/api/clothes/price-list`);
        return response.data.data
    }

    private async getClothesById(id: number): Promise<any> {
        const response = await axios.get(`http://localhost:8083/api/clothes/details/${id}`);
        return response.data.data
    }
}
