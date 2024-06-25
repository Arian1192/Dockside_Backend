import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Department } from './department.schema';

export type UserDocument = HydratedDocument<User>;

enum ROLE {
  ADMIN = 'admin',
  USER = 'user',
  SUPPORT = 'support',
  SUPER_ADMIN = 'super_admin',
}

@Schema()
export class User {
  @Prop({ required: true })
  Name: string;
  @Prop({ required: true })
  Email: string;
  @Prop({ required: true })
  Password: string;
  @Prop({ type: String, enum: ROLE, default: ROLE.USER })
  Role: ROLE;
  @Prop({ type: Types.ObjectId, ref: 'Department' })
  Department: Department[];
}

export const UserSchema = SchemaFactory.createForClass(User);
