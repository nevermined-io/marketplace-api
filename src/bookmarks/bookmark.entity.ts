import {v4 as uuidv4} from 'uuid';

export class Bookmark {
    id: string;
    did: string;
    userId: string;
    description: string;
    createdAt: Date;

    constructor() {
        this.createdAt = new Date();
        this.id = `bo-${uuidv4()}`;
    }
}