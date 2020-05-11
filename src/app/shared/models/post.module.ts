import { IPost } from '../interfaces/post.interface';

export class Post implements IPost {
    constructor(
        public id: string,
        public titleImg: string,
        public title: string,
        public description: string,
        public text: string,
        public date: Date,
        public author: string,
        public tags: Array<string>,
        public publish: boolean,
    ) { }
}

