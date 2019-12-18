import {injectable} from 'inversify';
import {ClothesType} from '../enams/ClothesType';
import {ClothesResponse} from '../response/ClothesResponse';
const axios = require('axios');
const https = require('https');

axios.defaults.httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50000, keepAliveMsecs: 3000000 });


@injectable()
export class FirstSourcesRepository {

    public async getAllClothes(): Promise<ClothesResponse[]> {
        const a = await Promise.all(Object.keys(ClothesType).map((type) => {
            const a = this.getAllClothesByType(ClothesType[type]);
            return a
        }));
        const c = a.reduce((a,b) => a.concat(b), []);
        return c
    }

    private async getAllClothesByType(type: ClothesType): Promise<[]> {
        const response = await axios.get(`http://localhost:8082/api/clothes/search?type=${type}`);
        return response.data.data
    }
}
