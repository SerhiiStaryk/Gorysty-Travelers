import { IQuote } from '../interfaces/quote.interface';

export class Quote implements IQuote {
    constructor(
        public id: string,
        public quote: string,
        public author: string,
        public date: Date
    ) { }
}
