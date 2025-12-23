import mongoose, { Schema, Document } from 'mongoose';

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

const ResourceSchema = new Schema<IResource>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  type: {
    type: String,
    enum: ['article', 'video', 'podcast'],
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['nutrition', 'exercise', 'mental-health', 'sleep', 'wellness', 'disease-prevention', 'weight-management']
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  duration: {
    type: String
  },
  author: {
    type: String
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IResource>('Resource', ResourceSchema);


