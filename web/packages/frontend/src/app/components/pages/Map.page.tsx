/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useContext, useEffect, useState } from 'react';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import axios from 'axios';
import { Filter, GasStationPosition, Position } from '@web/common/dto';
import { FilterStationContext } from '../../context/FilterStationContext';
import {
  ALL_STATION_URL,
  BACKEND_BASE_URL,
  FAVORITE_STATION_URL,
  FIND_URL,
  UPDATE_FAVORITE_STATION_URL
} from '../../const/url.const';
import { GeolocalisationContext } from '../../context/GeolocalisationContext';
import LeftSideMenu from '../left-menu/LeftSideMenu';
import GlobalMap from '../map/GlobalMap';
import MapTool from '../map/MapTool';
import {AuthContext} from "../../context/AuthContext";
import FavStationMenu from "../favorite-stations/FavStationMenu";
import { DrawContext } from '../../context/DrawContext';
import { MapContext } from '../../context/MapContext';
import { Map } from 'leaflet';
import { GasStationPositionContext } from '../../context/GasStationPositionContext';

//Extend marker prototype to fix : https://stackoverflow.com/questions/49441600/react-leaflet-marker-files-not-found
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;
const range = 20000


export default function MapPage() {
  const [stationList,setStationList] =useContext(GasStationPositionContext)
  const {filterState} = useContext(FilterStationContext)
  const [groupLayer, setGroupLayer] = useContext(DrawContext)
  const [map,setMap]:[Map, any] = useContext(MapContext);
  const {searchPosition} = useContext(GeolocalisationContext)

  function getAllStation(currentPos:Position, radius:number, filter:Filter) {
    console.log("CALL BACKEND FOR ALL STATION " + JSON.stringify(currentPos));
    axios.get(BACKEND_BASE_URL+ALL_STATION_URL, { params: { latitude: currentPos.lat, longitude: currentPos.lon, maxDist: radius, filter:filter } })
       .then(res => {
          const stations:GasStationPosition[] = res.data;
          setStationList(stations);
       });
  }

  function getAllStationByText(text:string){
    console.log("CALL BACKEND FOR SEARCH TEXT")
    axios.get(BACKEND_BASE_URL+FIND_URL, { params: {text:text,caseSensitive:false} })
       .then(res => {
          const stations:GasStationPosition[] = res.data;
          setStationList(stations);
       });
  }

  const addCircle = (lat:number,lon:number) =>{
    if (map?.hasLayer(groupLayer)){
        map.removeLayer(groupLayer)
      }
      let groupCircle = L.featureGroup();
      L.circle([lat, lon],filterState.range).addTo(groupCircle)
      map?.addLayer(groupCircle)
      setGroupLayer(groupCircle)
  }
  async function getFavoriteStation(){
    if(user!=''){
      console.log("CALL BACKEND FOR FAVORITE STATION OF ", user);
      console.log('displaying token ', token);
      try {
        const favorite = await axios.get(BACKEND_BASE_URL + FAVORITE_STATION_URL,
          {headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true",
              "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
              "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
            Authorization: 'Bearer ', token
          }
          });
        console.log('favorite stations are : ', favorite.data);
        setFavoriteStations(favorite.data);
      } catch (e){
        console.log(e);
      }
    }
  }


  useEffect(()=>{
    addCircle(searchPosition.lat, searchPosition.lon)
    getAllStation(searchPosition,filterState.range,{
      gas: filterState.gasFilter, 
      services: filterState.servicesFilter,
      schedules: []
    });
    getFavoriteStation().then(r => console.log('favorite stations in use effect : ', favoriteStations));
  },[filterState, position])

  return (
    <div>
      <div className='grid-wrapper'>
        <div className='grid-side-menu'>
          <LeftSideMenu gasStationList={stationList} />
        </div>
        <div className='grid-map'>
          <GlobalMap markersList={stationList}/>
          <MapTool />
        </div>
        <div className='grid-side-menu'>
          <FavStationMenu gasStationList={favoriteStations} />
        </div>
      </div>
    </div>
  );
}
