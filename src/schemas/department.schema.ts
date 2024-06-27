import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type DepartmentDocument = HydratedDocument<Department>;

@Schema()
export class Department {
  @Prop({ required: true })
  name: string;
  @Prop()
  description: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
