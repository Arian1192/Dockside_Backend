import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && !value.password) {
      throw new BadRequestException('Password is required in body');
    }
    const salt = await bcrypt.genSalt();
    value.password = await bcrypt.hash(value.password, salt);
    return value;
  }
}
