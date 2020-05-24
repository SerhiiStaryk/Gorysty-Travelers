import { ICity } from '../interfaces/city.interface';

export class City implements ICity {
    constructor(
        public id: string,
        public name: string,
        public titleImg: string,
        public longitude: number,
        public latitude: number
    ) { }
}
