import { ICategory } from './category.interface';
import { ITag } from './tag.interface';
import { IComment } from './comments.interface';

export interface IPost {
    id: string;
    type: string;
    category: ICategory;
    titleImg: string;
    title: string;
    description: string;
    text: string;
    date: Date;
    author: string;
    tags: Array<ITag>;
    comments: Array<IComment>;
    publish: boolean;
}
