export interface IPost {
    id: string;
    titleImg: string;
    title: string;
    text: string;
    date: Date;
    author: string;
    tags: Array<string>;
    publish: boolean;
}