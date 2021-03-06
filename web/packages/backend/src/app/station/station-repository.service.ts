import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {Filter,GasStationPosition} from '@web/common/dto';
import { Station } from '../schemas/station.schema';

@Injectable()
export class StationService {

  async createTextIndexWithWildCardForAll() {
    return await this.stationModel.collection.createIndex( { "$**": "text" } )
  }

  constructor(
    @InjectModel("STATION") private readonly stationModel: Model<Station>,
  ){}

  async update(id:string, station: Station){
    return await this.stationModel.findByIdAndUpdate(id, station, { new: true })
  }

  async delete(id:string){
    return await this.stationModel.findByIdAndRemove(id);
  }

  async createIndex(): Promise<string> {
    return await this.stationModel.collection.createIndex({coordinates:"2dsphere"});
  }

  public createFilterQuery(longitudeCurrent:number,latitudeCurrent:number,maxDist:number,filter:Filter):FilterQuery<Station>{
    const query:FilterQuery<Station> = {}

    if(longitudeCurrent&&latitudeCurrent&&maxDist){
      query.position={ 
        $nearSphere:{
          $geometry: {
            type: "Point" ,
            coordinates: [ longitudeCurrent , latitudeCurrent ]
          },
          $maxDistance:maxDist
        }
      }
    }
    if(filter){
      if(filter.services?.length>0){
        query.services={$in:filter.services}
      }
      if(filter.gas?.length>0){
        query["fuels.name"] = {$in:filter.gas}
      }
    }
    return query;
  }

  async findSphere(query:FilterQuery<Station>):Promise<Station[]>{
    if(query==undefined){
      query={}
    }

    const stations = await this.stationModel.find(query)
    return stations
  }

  async findAll(query:any): Promise<Station[]> {
    const stations : Station[] = await this.stationModel.find(query).exec();
    return stations
  }

  async findAllText(query:any): Promise<GasStationPosition[]> {
    const listGasStationPosition : GasStationPosition[] =[]
    const stations : Station[] = await this.stationModel.find(query).exec();

    return listGasStationPosition
  }


  async findStationById(id:string):Promise<Station|null>{
    return await this.stationModel.findOne({_id:id})// TODO opti request
  }

}

