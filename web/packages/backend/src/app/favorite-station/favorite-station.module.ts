import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoriteStationSchema } from '../schemas/favoriteStation.schema';
import { StationSchema } from '../schemas/station.schema';
import { FavoriteStationController } from './favorite-station.controller';
import { FavoriteStationService } from './favorite-station.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name:"STATION",schema: StationSchema },
      { name: 'FAVORITE_STATION', schema: FavoriteStationSchema }
    ]),
  ],
  controllers: [FavoriteStationController],
  providers: [FavoriteStationService]
})
export class FavoriteStationModule {}
