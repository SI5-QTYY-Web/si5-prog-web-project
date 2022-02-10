/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from './app.module.scss';
import React, { useEffect, useState } from 'react';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import axios from 'axios';
import GlobalMap from './components/GlobalMap';
import { Filter, GasStationInfo, GasStationPosition, Position } from '@web/common/dto';
import SideMenu from './components/SideMenu';
import FilterBar from './components/FilterBar';


//Extend marker prototype to fix : https://stackoverflow.com/questions/49441600/react-leaflet-marker-files-not-found
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

const ALL_STATION_URL = "http://localhost:3333/api/station/near-station"
const STATION_INFO = "http://localhost:3333/api/station/stations"

const range = 20000


function App() {
  const [stationList,setStationList] = useState<GasStationPosition[]>([]);
  const [gasStationInfo,setGasStationInfo] = useState<GasStationInfo>();
  const servicesList:string[]=[
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
  const [filter, setFilter] = useState<Filter>({gas:['Gazole', 'SP95','E85', 'GPLc', 'E10', 'SP98'],schedules:[],services:servicesList});
  const [position, setPosition] = useState<Position>({lat:43.675819, lon:7.289429});

  //const testPos:Position = navigator.geolocation.getCurrentPosition(onPositionChange());

  function getAllStation(currentPos:Position, radius:number, filter:Filter) {
    console.log("CALL BACKEND FOR ALL STATION")
    axios.get(ALL_STATION_URL, { params: { latitude: currentPos.lat, longitude: currentPos.lon, maxDist: radius, filter:filter } })
       .then(res => {
          console.log("Receive response "+JSON.stringify(res));
          const stations:GasStationPosition[] = res.data;
          setStationList(stations);
       });
  }

  function getStationInfo(stationId:string) {
    console.log("CALL BACKEND FOR STATION INFO "+stationId)
    axios.get(STATION_INFO+"/"+stationId)
       .then(res => {
          console.log("Receive response "+JSON.stringify(res))
          setGasStationInfo(res.data);
       });
  }

  useEffect(()=>{//== ComponentDidMount
    getAllStation(position,range,filter);
    //setStationList([{id:"station test",position:{lat:43.675819,lon:7.289429},prices:[{price:"50.5",gasType:"E10"},{price:"70.5",gasType:"SP98"}], address:"rue de mon cul"}])
  },[])

  useEffect(()=>{//== ComponentDidMount
    getAllStation(position,range,filter);
    //setStationList([{id:"station test",position:{lat:43.675819,lon:7.289429},prices:[{price:"50.5",gasType:"E10"},{price:"70.5",gasType:"SP98"}], address:"rue de mon cul"}])
  },[filter])


  const onMarkerClick = (stationId:string) =>{
    getStationInfo(stationId)
    // setGasStationInfo({id:"station test", address:"Station de mon cul",
    //   prices:[{price:"50.5",gasType:"E10"},{price:"70.5",gasType:"SP98"}],
    //   services:["Station de gonflage", "Location de véhicule"],
    //   schedules:[{day:"Lundi", openned:true,hourSchedule:[{openHour:"8h00", closedHour:"22h00"}]},
    //     {day:"Mardi", openned:true,hourSchedule:[{openHour:"8h00", closedHour:"12h00"},{openHour:"14h00", closedHour:"22h00"}] },{day:"Samedi",openned:false}]})
  }

  const onFilterCheckBoxClick = (type:string, gas:string, checked:boolean) =>{
    if(type === "gas"){
      let newGasFilter:string[]|undefined;
      if(checked){
        newGasFilter = filter.gas.concat([gas]);
      }
      else{
        newGasFilter = filter?.gas.filter((el) =>{return el !== gas});
      }
      setFilter({gas:newGasFilter, services:filter.services,schedules:filter.schedules})
    }
    if(type === "services"){
      let newServiceFilter:string[]|undefined;
      if(checked){
        newServiceFilter = filter.services.concat([gas]);
      }
      else{
        newServiceFilter = filter?.services.filter((el) =>{return el !== gas});
      }
      setFilter({gas:filter.gas, services:newServiceFilter,schedules:filter.schedules})
    }
  }

  const onPositionChange = (lat:number, lon:number) => {
    setPosition({lat: lat, lon: lon});
  }

  return (
    <div>
      <FilterBar onCheckBoxClick={onFilterCheckBoxClick} />
      <SideMenu gasStationInfo={gasStationInfo}/>
      <GlobalMap markersList={stationList} position={position} onMarkerClick={onMarkerClick}/>
    </div>
  );
}

export default App;
