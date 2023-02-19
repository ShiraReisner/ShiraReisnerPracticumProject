export class User {
    id!: number;
    firstName!: string;
    lastName!: string;
    birthday!: Date;
    TZ!: string;
    gender!: number;
    HMO!: number;
    children: User[] = [];
}
