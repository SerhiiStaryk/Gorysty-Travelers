import { IUser } from '../interfaces/user.interface';

export class User implements IUser {
    constructor(
        public email: string,
        public password: string,
        public returnSecureToken: boolean
    ) { }
}
