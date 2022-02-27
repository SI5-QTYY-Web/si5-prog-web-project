import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { environment } from '../environments/environment';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { StationLoaderService } from './station/station-loader/station-loader.service';
import { StationService } from './station/station-repository.service';
import { StationController } from './station/station.controller';
import {UserSchema} from "./schemas/user.schema";
import {AuthModule} from "./authentication/auth.module";
import { StationSchema } from './schemas/station.schema';
import { StationFilterList } from './station/station-filter-list.service';
import { ChartController } from './station/chart/chart.controller';
import { ChartService } from './station/chart/chart.service';
import { FavoriteStationModule } from './favorite-station/favorite-station.module';
import { FavoriteStationSchema } from './schemas/favoriteStation.schema';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(environment.DATABASE,{authSource:"admin"}),
    MongooseModule.forFeature([
      { name:"STATION",schema: StationSchema },
      { name: 'USER', schema: UserSchema },
      { name: "FAVORITE_STATION", schema: FavoriteStationSchema }
    ]),
    HttpModule,
    AuthModule,
    FavoriteStationModule,
  ],
  controllers: [
    StationController,
    ChartController
  ],
  providers: [
    StationLoaderService,
    StationService,
    StationFilterList,
    ChartService
  ],
})
export class AppModule {

}
