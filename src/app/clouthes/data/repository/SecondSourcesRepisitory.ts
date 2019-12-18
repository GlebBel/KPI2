import {injectable} from 'inversify';
import {ClothesResponse} from '../response/ClothesResponse';
const axios = require('axios');
const https = require('https');
const hp =  require("xmlhttprequest").XMLHttpRequest;
const promiseLimit = require('promise-limit');
let request = new hp();


axios.defaults.httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50000, keepAliveMsecs: 3000000 });

@injectable()
export class SecondSourcesRepisitory {

    public async getAllClothes(): Promise<ClothesResponse[]> {
        const clothesIds = await this.getAllClothesId();
        const collector: ClothesResponse[] = [];

        const arrayPromises = clothesIds.map(e => {
            return this.getClothesById(e.id);
        });

        // const ca = this.chunkArray(arrayPromises, 1000);
        // const aa = ca.map(e => Promise.all(e));
        //
        // // aa.reduce(async (previousPromise, nextAsyncFunction) => {
        // //     await previousPromise;
        // //     const result = await nextAsyncFunction();
        // //     console.log(result);
        // // }, Promise.resolve());
        //
        // aa.reduce((promiseChain, currentTask) => {
        //     return promiseChain.then(chainResults =>
        //         currentTask.then(currentResult =>
        //             [ ...chainResults, currentResult ]
        //         )
        //     );
        // }, Promise.resolve([])).then(arrayOfResults => {
        //     const uu = arrayOfResults;
        //     console.log(uu)
        // });
        //
        // const clothes = Promise.all(await clothesIds.map(e => {
        //     return this.getClothesById(e.id);
        // }));
        // clothesIds.forEach((elem) => {
        //     request.open('GET', `http://localhost:8083/api/clothes/details/${elem.id}`, false);  // `false` makes the request synchronous
        //     request.send(null);
        //     const a = JSON.parse(request.responseText).data;
        //     collector.push(a);
        // });
        const b = await  this.promiseAllLimit(arrayPromises, 100, async (e) => {
            const d = await e;
            console.log(e)
        });
        console.log(b)
        return collector
    }

    private async getAllClothesId(): Promise<any[]> {
        let data: any;
        let collector = [];
        let page = 0;
        let promises: Promise<any>[]= [];
        do {
            data = await axios.get(`http://localhost:8083/api/clothes/price-list?page=${page}&size=5000`);
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

}
