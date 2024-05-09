import { Document } from 'mongoose';

export interface IStudent extends Document {
    readonly id: string;
    readonly data: any;
    readonly type: string;
}