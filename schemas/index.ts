import { TicketSchema } from './ticket.schema';
import { CategorySchema } from './category.schema';
import { UserSchema } from './user.schema';
export const Schemas = [
  { name: 'User', schema: UserSchema },
  { name: 'Ticket', schema: TicketSchema },
  { name: 'Category', schema: CategorySchema },
];
