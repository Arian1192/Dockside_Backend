import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from '../schemas/index';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://ariancollasorodriguez:831M7S65ckzcrDXc@cluster0.20nkdml.mongodb.net/test?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature(Schemas),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
