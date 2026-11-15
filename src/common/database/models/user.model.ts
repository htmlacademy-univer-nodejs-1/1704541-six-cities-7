import { Schema, Types, model, type HydratedDocument } from 'mongoose';
import { USER_TYPES } from '../../../constants.js';
import type { User } from '../../../types/index.js';

export interface UserEntity extends User {
  favorites: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserEntity>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarPath: { type: String },
    password: { type: String, required: true },
    type: { type: String, enum: [...USER_TYPES], required: true },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Offer' }],
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

export type UserDocument = HydratedDocument<UserEntity>;

export const UserModel = model<UserEntity>('User', userSchema);
