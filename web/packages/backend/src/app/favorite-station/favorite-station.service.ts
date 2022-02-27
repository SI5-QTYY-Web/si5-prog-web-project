import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GasStationPosition } from '@web/common/dto';
import { Model } from 'mongoose';
import { GasStationPositionDTO } from '../dto/GasStationPositionDTO';
import { FavoriteStation } from '../schemas/favoriteStation.schema';
import { Station } from '../schemas/station.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class FavoriteStationService {

    constructor(
        @InjectModel("FAVORITE_STATION") private readonly favoriteStationModel: Model<FavoriteStation>,
        @InjectModel("STATION") private readonly stationModel: Model<Station>,
    ){}

    async getUserFavoriteStations(user:User){
        const favoriteStation = await this.favoriteStationModel.findOne({username:user.username});

        if(!favoriteStation){
            console.log("There is no favorite station for "+user.username+" in the DB");
            return [];
        }
        console.log("get favorite station Id "+favoriteStation.favoriteStations+" for user "+user.username);
        const IdList =  favoriteStation!.favoriteStations || [];
        const stationList:GasStationPosition[] = []

        for(let stationID of IdList){
            const station = await this.stationModel.findById(stationID);
            if(station){
                stationList.push(GasStationPositionDTO.fromStation(station));
            }
        }
        console.log("Return station "+JSON.stringify(stationList));
        return stationList;
    }


    async setUserFavoriteStations(user:User, newFavStations:string[]){
        try{
        const favStation:FavoriteStation = {username:user.username, favoriteStations:newFavStations}
        await this.favoriteStationModel.updateOne({username:user.username},favStation, {upsert:true});

        console.log("update or insert favorite station for user "+user.username+" with ["+newFavStations.join(",")+"]");
        }catch(err){
            console.log("No favorit station")
        }
    }
}
