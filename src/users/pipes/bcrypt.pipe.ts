import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }
    if (value && value.password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(value.password, salt);
      value.password = hash; // Replace plain password with hashed password
    }

    return value;
  }
}
