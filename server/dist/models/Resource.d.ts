import mongoose, { Document } from 'mongoose';
export interface IResource extends Document {
    title: string;
    description: string;
    type: 'article' | 'video' | 'podcast';
    category: string;
    url: string;
    thumbnail?: string;
    duration?: string;
    author?: string;
    tags: string[];
    createdAt: Date;
}
declare const _default: mongoose.Model<IResource, {}, {}, {}, mongoose.Document<unknown, {}, IResource, {}, {}> & IResource & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Resource.d.ts.map