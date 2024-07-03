import { TicketSchema } from './ticket.schema';
import { CategorySchema } from './category.schema';
import { UserSchema } from './user.schema';
import { DepartmentSchema } from './department.schema';
import { CommentSchema } from './comment.schema';

export const Schemas = [
  { name: 'User', schema: UserSchema },
  { name: 'Ticket', schema: TicketSchema },
  { name: 'Category', schema: CategorySchema },
  { name: 'Department', schema: DepartmentSchema },
  { name: 'Comment', schema: CommentSchema },
];
