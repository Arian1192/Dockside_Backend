import { SetMetadata } from '@nestjs/common';
import { ROLE } from '../src/schemas/user.schema';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLE[]) => SetMetadata(ROLES_KEY, roles);
