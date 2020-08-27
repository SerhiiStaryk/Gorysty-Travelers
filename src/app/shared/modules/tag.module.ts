import { ITag } from '../interfaces/tag.interface';

export class Tag implements ITag {
    constructor(
        public id: string,
        public name: string
    ) { }
}
