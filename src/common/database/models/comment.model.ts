import { Schema, Types, model, type HydratedDocument } from 'mongoose';
import type { Comment } from '../../../types/index.js';

export interface CommentEntity extends Omit<Comment, 'author'> {
  author: Types.ObjectId;
  offerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<CommentEntity>(
  {
    text: { type: String, required: true },
    publicationDate: { type: Date, required: true, default: Date.now },
    rating: { type: Number, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    offerId: { type: Schema.Types.ObjectId, ref: 'Offer', required: true, index: true },
  },
  {
    timestamps: true,
    collection: 'comments',
  },
);

export type CommentDocument = HydratedDocument<CommentEntity>;

export const CommentModel = model<CommentEntity>('Comment', commentSchema);
