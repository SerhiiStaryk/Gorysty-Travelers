import { IPhoto } from '../interfaces/photo.interface';
import { ITag } from '../interfaces/tag.interface';
import { ICategory } from '../interfaces/category.interface';

export class Photo implements IPhoto {
    constructor(
        public id: string,
        public category: ICategory,
        public source: string,
        public date: Date,
        public tags: Array<ITag>
    ) { }
}