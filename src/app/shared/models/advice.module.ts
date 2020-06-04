import { IAdvice } from '../interfaces/advice.interface';

export class Advice implements IAdvice {
    constructor(
        public id: string,
        public text: string,
        public date: Date
    ) { }
}
