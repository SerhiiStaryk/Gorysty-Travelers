import { ITag } from './tag.interface';
import { ICategory } from './category.interface';

export interface IPhoto {
    id: string;
    category: ICategory;
    source: string;
    date: Date;
    tags: Array<ITag>;
}
