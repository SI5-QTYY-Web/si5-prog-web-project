import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FavoriteStation } from '../schemas/favoriteStation.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class FavoriteStationService {

    constructor(
        @InjectModel("FAVORITE_STATION") private readonly favoriteStationModel: Model<FavoriteStation>,
    ){}

    async getUserFavoriteStations(user:User){
        const favoriteStation = await this.favoriteStationModel.findOne({username:user.username});

        if(!favoriteStation){
            console.log("There is no favorite station for "+user.username+" in the DB");
            return undefined;
        }
        console.log("Return favorite station "+favoriteStation.favoriteStations+" for user "+user.username);
        return favoriteStation?.favoriteStations;
    }


    async setUserFavoriteStations(user:User, newFavStations:string[]){
        const favStation:FavoriteStation = {username:user.username, favoriteStations:newFavStations}
        await this.favoriteStationModel.updateOne({username:user.username},favStation, {upsert:true});

        console.log("update or insert favorite station for user "+user.username+" with ["+newFavStations.join(",")+"]");
    }
}
