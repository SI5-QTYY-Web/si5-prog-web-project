import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import AdmZip = require('adm-zip');
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import convert = require('xml-js');
import { StationService } from '../station-repository.service';
import { LoadStation } from './load-schema/load-station.class';
import { Point } from 'geojson'
import { transformLoadStationToModelStation } from './load-schema/station-transformer';
import { Station } from '../../schemas/station.schema';
import { StationFilterList } from '../station-filter-list.service';

@Injectable()
export class StationLoaderService {
  private URL_API_GOUV = "https://donnees.roulez-eco.fr/opendata/instantane"

  constructor(private http:HttpService,
    private stationRepository:StationService,
    private stationFilter:StationFilterList,
    @InjectModel("STATION") private readonly stationModel: Model<Station>,
    
    ){

  }

  onModuleInit(){
    this.refreshStation();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async refreshStation() {
    // const today = new Date()
    // const date = new Date(today)

    // date.setDate(date.getDate() - 1)
    // const day = date.toString().split(" ")[2]
    // const month = date.getUTCMonth()+1

    // let url = ""

    // if (month<10){
    //   url="https://donnees.roulez-eco.fr/opendata/jour/"+date.getFullYear()+ "0"+month+day
    // }
    // else {
    //   url="https://donnees.roulez-eco.fr/opendata/jour/"+date.getFullYear()+ month +day}
    console.log("CRON: start update from gouv api")
    const loadStationList = await this.loadStation();
    const stationSchemaList = loadStationList.map(transformLoadStationToModelStation)
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const writeOperation:any = stationSchemaList.map((station: Station) => {
      return ({
        updateOne: {
          filter: { _id: station._id },
          update: { $set: station },
          upsert: true
        }
      });
    })
    writeOperation.push(
      {
        deleteMany:{
          filter:{_id:{$not: {$in: stationSchemaList.map((station:Station)=>station._id)}}}
        }
      }
    )
    const result = await this.stationModel.bulkWrite(writeOperation)

    // await this.stationModel.deleteMany()

    // for( const station of stationSchemaList){ //FOR DEBUG ONLY
    //   console.log(station.position)
    //   await this.stationModel.create(new this.stationModel(station))
    // }
    // const stationSchemaListSaved = await this.stationModel.insertMany(stationSchemaList)
    console.log("nMatched :"+result.result.nMatched);
    console.log("nInserted :"+result.result.nUpserted);
    console.log("nModified :"+result.result.nModified);
    console.log("nRemoved :"+result.result.nRemoved);

    this.stationFilter.refreshAll()
    console.log("CRON: successful update")

  }

  async getAndUnZip() :Promise<string>{
    const zipFileBuffer:Buffer = await firstValueFrom(this.http.get(this.URL_API_GOUV,{responseType: "arraybuffer"})).then((data)=>data.data);
    const zip = new AdmZip(zipFileBuffer);
    const entries = await zip.getEntries();
    for(const entry of entries) {
        const buffer = entry.getData();
        return buffer.toString("latin1");
    }
    throw "unable to update data"
  }
  async getJsonFromUrl(){
    const xml=await this.getAndUnZip()
    return convert.xml2json(xml, {compact: true});
  }

  async loadStation() :Promise<LoadStation[]>{
      const resultJson=await this.getJsonFromUrl();
      const dict=JSON.parse(resultJson);
      const arrayLocal:LoadStation[]=[];
      for (const element of dict["pdv_liste"]["pdv"]){
        const geoJsonPoint:Point={
          type: 'Point',
          coordinates:[element["_attributes"]["longitude"]*0.00001 , element["_attributes"]["latitude"]*0.00001]
        }
        element.location=geoJsonPoint;
        arrayLocal.push(element);
      }
      return arrayLocal;
      // await this.stationModel.deleteMany();
      // return await this.stationModel.insertMany(arrayLocal)
  }

  // deltaDate(input, days, months, years) {
  //   return new Date(
  //     input.getFullYear() + years,
  //     input.getMonth() + months,
  //     Math.min(
  //       input.getDate() + days,
  //       new Date(input.getFullYear() + years, input.getMonth() + months + 1, 0).getDate()
  //     )
  //   );
  // }
}
