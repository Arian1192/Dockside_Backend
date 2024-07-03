import { Types } from 'mongoose';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsMongoId,
  IsArray,
  IsOptional,
} from 'class-validator';
import { PRIORITY, STATUS } from 'src/schemas/ticket.schema';

export class TicketDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;
  @IsEnum(STATUS, { message: 'Invalid status value' })
  status: STATUS;
  @IsEnum(PRIORITY, { message: 'Invalid priority value' })
  priority: PRIORITY;
  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;
  @IsOptional()
  @IsDate()
  closedAt?: Date;
  @IsMongoId({ message: 'CreatorId must be a valid ObjectId' })
  creatorId: Types.ObjectId;
  @IsOptional()
  @IsMongoId({ message: 'AgentId must be a valid ObjectId' })
  agentId: Types.ObjectId;
  @IsOptional()
  @IsMongoId({ message: 'CategoryId must be a valid ObjectId' })
  categoryId: Types.ObjectId;
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true, message: 'Each comment must be a valid ObjectId' })
  comments: Types.ObjectId[];
}
