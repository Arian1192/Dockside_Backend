import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Schemas } from '../schemas/index';

const MONGO_URI = process.env.MONGO_URI;

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI || 'mongodb://localhost/nest'),
    MongooseModule.forFeature(Schemas),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
