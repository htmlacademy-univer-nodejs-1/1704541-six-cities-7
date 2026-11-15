import type { CreateCommentDto } from '../dto/index.js';
import type { CommentDocument } from '../models/comment.model.js';

export interface CommentService {
  findByOfferId(offerId: string, limit?: number): Promise<CommentDocument[]>;
  create(offerId: string, dto: CreateCommentDto, authorId: string): Promise<CommentDocument | null>;
  deleteByOfferId(offerId: string): Promise<void>;
}
