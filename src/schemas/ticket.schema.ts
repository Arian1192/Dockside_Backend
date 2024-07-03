import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum STATUS {
  PENDING = 'pending',
  OPEN = 'open',
  ASSIGNED = 'assigned',
  INPROGRESS = 'in progress',
  DONE = 'done',
  ELEVATED = 'elevated',
}

export enum PRIORITY {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}
@Schema({ timestamps: true }) // This enables automatic createdAt and updatedAt fields
export class Ticket {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, maxlength: 250 })
  description: string;

  @Prop({
    type: String,
    enum: Object.values(STATUS),
    default: STATUS.PENDING,
  })
  status: STATUS;

  @Prop({
    type: String,
    enum: Object.values(PRIORITY),
    default: PRIORITY.LOW,
  })
  priority: PRIORITY;

  @Prop()
  closedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creatorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  agentId: Types.ObjectId | undefined;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  categoryId: Types.ObjectId | undefined;

  @Prop([{ type: Types.ObjectId, ref: 'Comment' }])
  comments: Types.ObjectId[] | undefined;
}

export type TicketDocument = Document & Ticket;

export const TicketSchema = SchemaFactory.createForClass(Ticket);

// Combined index creation for optimized search performance
TicketSchema.index({ createdAt: 1, agentId: 1, categoryId: 1 });
