import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Ticket } from './ticket.schema';
import { User } from './user.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Ticket', required: true })
  ticket: Ticket;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
