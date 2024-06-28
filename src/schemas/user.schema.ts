import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Department } from './department.schema';

export type UserDocument = HydratedDocument<User>;

export enum ROLE {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  SUPPORT = 'support',
  SUPER_ADMIN = 'super_admin',
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ type: String, enum: ROLE, default: ROLE.USER })
  role: ROLE;
  @Prop({ type: Types.ObjectId, ref: 'Department', default: [] })
  department: Department[];
}

export const UserSchema = SchemaFactory.createForClass(User);
