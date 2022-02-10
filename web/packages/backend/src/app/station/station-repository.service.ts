import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Station } from '../schemas/station.schema';
import {Filter,GasStationPosition,Position,GasPrice, GasStationInfo, GasStationSchedule} from '@web/common/dto';
import { GasStationHourSchedule } from 'packages/common/dto/src/lib/gas-station-hour-schedule';

@Injectable()
export class StationService {

  constructor(
    @InjectModel("STATION") private readonly stationModel: Model<Station>,
  ){

  }

  async update(id:string, station: Station){
    return await this.stationModel.findByIdAndUpdate(id, station, { new: true })
  }

  async delete(id:string){
    return await this.stationModel.findByIdAndRemove(id);
  }

  async createIndex(): Promise<string> {
    return await this.stationModel.collection.createIndex({coordinates:"2dsphere"});
  }

  async findSphere(longitudeCurrent:number,latitudeCurrent:number,maxDist:number,filter:Filter){
    console.log("\n\n\n"+JSON.stringify(filter)+"\n\n\n end of filter")
    let listOrGas = []
    let listOrService = []
    if (filter.gas.length == 0){
      filter.gas=["Gazole",
        "SP95",
        "E85",
        "GPLc",
        "E10",
        "SP98"]
    }

    if (filter.services.length == 0){
      filter.services= [
        "Aire de camping-cars",
        "Bar",
        "Bornes électriques",
        "Boutique alimentaire",
        "Boutique non alimentaire",
        "Carburant additivé",
        "DAB (Distributeur automatique de billets)",
        "Douches",
        "Espace bébé",
        "GNV",
        "Lavage automatique",
        "Lavage manuel",
        "Laverie",
        "Location de véhicule",
        "Piste poids lourds",
        "Relais colis",
        "Restauration à emporter",
        "Restauration sur place",
        "Services réparation / entretien",
        "Station de gonflage",
        "Toilettes publiques",
        "Vente d'additifs carburants",
        "Vente de fioul domestique",
        "Vente de gaz domestique (Butane, Propane)",
        "Vente de pétrole lampant",
        "Wifi"]
    }

    for (const gasType of filter.gas){

      listOrGas.push({ prix : { $elemMatch : { "_attributes.nom": gasType }} } )}

    for (const gasService of filter.services){

      listOrService.push({ "services.service" : { $elemMatch : { "_text": gasService }} } )}

    let query ={coordinates:{ $nearSphere: { $geometry: { type: "Point", coordinates: [ longitudeCurrent, latitudeCurrent ] }, $maxDistance: maxDist }},
    "$and":[{"$or":listOrGas},{"$or":listOrService}]}
    let listGasStationPosition : GasStationPosition[] =[]
    console.log(JSON.stringify(query))
    let stations : Station[] = await this.stationModel.find(query).exec();
    
    for (let station of stations){
      let address=""
      let id=""
      let pos:Position={lat:0,lon:0}
      let gasInfoArray = []
      if (station?.adresse?._text){
        address=station.adresse._text}
      if (station?.coordinates){
        let latLongArray:number[]=station.coordinates
        pos.lon=latLongArray[0]
        pos.lat=latLongArray[1]
      }
      if (station?._attributes?.id){
        id=station._attributes.id
      }
      if (station?.prix){
        for (const gasInfo of station.prix){
          gasInfoArray.push({gasType:gasInfo._attributes.nom,price:gasInfo._attributes.valeur})
        }
      }
      let gasPrice :GasPrice[] = gasInfoArray
      
      let gasPos : GasStationPosition = {id:id,position:pos,address:address,prices:gasPrice}  
      listGasStationPosition.push(gasPos)
    }
    return listGasStationPosition
  }

  async findAll(query:any): Promise<Station[]> {
    console.log(query)
    return this.stationModel.find(query).exec();
  }


  async readById(id:string){
    let stations : Station[] = await this.stationModel.find({"_attributes.id":id}).exec();
    console.log("\n\n\n"+JSON.stringify(stations)+"\n\n\n");

    let listGasStationInfo : GasStationInfo[] =[]
    for (let station of stations){
      let address=""
      let id=""
      let pos:Position={lat:0,lon:0}
      let gasInfoArray = []
      let gasServicesArray = []
      if (station?.adresse?._text){
        address=station.adresse._text}
      if (station?.coordinates){
        let latLongArray:number[]=station.coordinates
        pos.lon=latLongArray[0]
        pos.lat=latLongArray[1]
      }
      if (station?._attributes?.id){
        id=station._attributes.id
      }
      if (station?.prix){
        for (const gasInfo of station.prix){
          if (gasInfo?._attributes){
          gasInfoArray.push({gasType:gasInfo._attributes.nom,price:gasInfo._attributes.valeur})
          }
        }
      }
      if (station?.services?.service){
        if (station?.services?.service.length>0){
        for (const serviceInfo of station.services.service){
          if (serviceInfo._text){
          gasServicesArray.push(serviceInfo._text)
            }
          }
        }
      }
      let schedules: GasStationSchedule[] = []
      if (station?.horaires?.jour){


        for (const scheduleInfo of station?.horaires?.jour){
          let gasHourInfo:GasStationHourSchedule[]= []
          if (scheduleInfo?.horaire?._attributes){
          let openString :string = (+scheduleInfo.horaire._attributes.ouverture.split(".")[0])+"h"+scheduleInfo.horaire._attributes.ouverture.split(".")[1]
          let closeString :string = (+scheduleInfo.horaire._attributes.fermeture.split(".")[0])+"h"+scheduleInfo.horaire._attributes.fermeture.split(".")[1]
          gasHourInfo.push({
            openHour:openString,
            closedHour:closeString
        })}
        let closed : boolean
        if (scheduleInfo?._attributes.ferme==''){
          closed=true
        }
        else {
          closed =false
        }
        
        if(scheduleInfo?._attributes){
        schedules.push({day:scheduleInfo._attributes.nom,openned:closed,
          hourSchedule:gasHourInfo})
        }
        else {
          schedules.push({day:"NoNameFund",openned:closed,
          hourSchedule:gasHourInfo})
        }
      }
    }


      let gasPrice :GasPrice[] = gasInfoArray
      
      let gasStationInfoToPush : GasStationInfo = {id:id,address:address,prices:gasPrice,services:gasServicesArray,schedules:schedules}  
      listGasStationInfo.push(gasStationInfoToPush)
    }
    console.log(JSON.stringify(listGasStationInfo[0]))
    return listGasStationInfo[0]
  }

}
