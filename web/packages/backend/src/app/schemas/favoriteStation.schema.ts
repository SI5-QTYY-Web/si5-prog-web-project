import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FavoriteStationDocument = FavoriteStation & Document;

@Schema()
export class FavoriteStation {
  
    @Prop({unique:true})
    username?: string;

    @Prop()
    favoriteStations?: string[];
}

export const FavoriteStationSchema = SchemaFactory.createForClass(FavoriteStation);
