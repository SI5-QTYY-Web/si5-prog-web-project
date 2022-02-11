import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { StationSchema } from './schemas/station.schema';
import { environment } from '../environments/environment';

import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { StationLoaderService } from './station/station-loader/station-loader.service';
import { StationService } from './station/station-repository.service';
import { StationController } from './station/station.controller';
import {UserSchema} from "./schemas/user.schema";
import {AuthModule} from "./authentication/auth.module";
import {UsersModule} from "./users/users.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(environment.DATABASE,{authSource:"admin"}),
    MongooseModule.forFeature([
      { name:"STATION",schema: StationSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'USER', schema: UserSchema }
    ]),
    HttpModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [
    StationController,
  ],
  providers: [
    StationLoaderService,
    StationService,
  ],
})
export class AppModule {

}
