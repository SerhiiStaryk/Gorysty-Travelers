import { IComment } from '../interfaces/comments.interface';

export class Comment implements IComment {
    constructor(
        public id: string,
        public userName: string,
        public userEmail: string,
        public date: Date,
        public comment: string,
        public status: boolean = false
    ) { }
}