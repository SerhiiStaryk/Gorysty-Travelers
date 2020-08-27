import { IPost } from '../interfaces/post.interface';
import { ICategory } from '../interfaces/category.interface';
import { ITag } from '../interfaces/tag.interface';
import { IComment } from '../interfaces/comments.interface';

export class Post implements IPost {
    constructor(
        public id: string,
        public type: string,
        public category: ICategory,
        public titleImg: string,
        public title: string,
        public description: string,
        public text: string,
        public date: Date,
        public author: string,
        public tags: Array<ITag>,
        public comments: Array<IComment>,
        public publish: boolean = false
    ) { }
}

