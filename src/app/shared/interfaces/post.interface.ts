import { ICategory } from './category.interface';

export interface IPost {
    id: string;
    category: ICategory;
    titleImg: string;
    title: string;
    description: string;
    text: string;
    date: Date;
    author: string;
    tags: Array<string>;
    publish: boolean;
}