import { IsObject, IsString, MaxLength } from 'class-validator';
import { Types } from 'mongoose';
export class DepartmentsDto {
  @IsObject()
  _id?: Types.ObjectId;
  @IsString()
  @MaxLength(50, { message: 'name must be at most 50 characters' })
  name?: string;
  @IsString()
  @MaxLength(100, { message: 'description must be at most 100 characters' })
  description?: string;
}
