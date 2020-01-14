import {injectable} from 'inversify';
import {ClothesResponse} from '../response/ClothesResponse';
const axios = require('axios');
const http = require('http');
const hp =  require("xmlhttprequest").XMLHttpRequest;

import parallelLimit from 'async/parallelLimit';
import * as asyncc from "async"
const promiseLimit = require('promise-limit');
let request = new hp();


axios.defaults.httpsAgent = new http.Agent({ keepAlive: true, maxSockets: 100, keepAliveMsecs: 30000 });

@injectable()
export class SecondSourcesRepisitory {

    public async getAllClothes(): Promise<ClothesResponse[]> {
            const clothesIds = await this.getAllClothesId();
            const collector: ClothesResponse[] = [];

            const arrayPromises = await clothesIds.map(e => {
                return this.getClothesById(e.id);
            });


            // //const resp = parallelLimit(arrayPromises, 10);
        // const resp = asyncc.parallelLimit(arrayPromises, 10);


            return Promise.all(arrayPromises)
    }

    private async getAllClothesId(): Promise<any[]> {
        let data: any;
        let collector = [];
        let page = 0;
        let promises: Promise<any>[]= [];
        do {
            data = await axios.get(`http://localhost:8083/api/clothes/price-list?page=${page}&size=5000`);
            // data = http.get(`http://localhost:8083/api/clothes/price-list?page=${page}&size=5000`);
            collector = collector.concat(data.data.data);
            page++;
        } while (data.data.data.length);

        return collector
    }

    private async getClothesById(id: number): Promise<any> {
        const response = await axios.get(`http://localhost:8083/api/clothes/details/${id}`);
        return response.data.data
    }

    private chunkArray(myArray, chunk_size){
        let index = 0;
        let arrayLength = myArray.length;
        let tempArray: any[] = [];

        for (index = 0; index < arrayLength; index += chunk_size) {
            let myChunk = myArray.slice(index, index+chunk_size);
            tempArray.push(myChunk);
        }

        return tempArray;
    }

    private promiseAllLimit(arr, concurrency, mapper) {
        const limit = promiseLimit(concurrency);
        return Promise.all(arr.map(function (item) {
            return limit(function () {
                return mapper(item);
            });
        }));
    }

    private asyncLimit(fn, n) {
        let pendingPromises: any[] = [];
        return async function (...args) {
            while (pendingPromises.length >= n) {
                await Promise.race(pendingPromises).catch(() => {});
            }

            const p = fn.apply(this, args);
            pendingPromises.push(p);
            await p.catch(() => {});
            pendingPromises = pendingPromises.filter(pending => pending !== p);
            return p;
        };
    };

}
