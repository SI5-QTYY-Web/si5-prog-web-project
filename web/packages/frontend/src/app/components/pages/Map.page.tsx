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
} from '../../const/url.const';
import { GeolocalisationContext } from '../../context/GeolocalisationContext';
import LeftSideMenu from '../left-menu/LeftSideMenu';
import GlobalMap from '../map/GlobalMap';
import MapTool from '../map/MapTool';
import {AuthContext} from "../../context/AuthContext";
import useAxios from '../../hooks/axios-auth';
import { MapContext } from '../../context/MapContext';
import { Map } from 'leaflet';
import { GasStationPositionContext } from '../../context/GasStationPositionContext';

//Extend marker prototype to fix : https://stackoverflow.com/questions/49441600/react-leaflet-marker-files-not-found
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;


export default function MapPage() {
  const [stationList,setStationList] =useContext(GasStationPositionContext)
  const {filterState} = useContext(FilterStationContext)
  const {user, favoriteStations, setFavoriteStations, isLogged} = useContext(AuthContext)
  const axiosAuth = useAxios()

  const {searchPosition} = useContext(GeolocalisationContext)
  const {map}:{map:Map} = useContext(MapContext);
  const [groupLayer, setGroupLayer] = useState<L.FeatureGroup<any>|undefined>()



  useEffect(()=>{
    const addCircle = (lat:number,lon:number) =>{
      if (groupLayer && map?.hasLayer(groupLayer)){
        map.removeLayer(groupLayer)
      }
      const groupCircle = L.featureGroup();
      L.circle([lat, lon],filterState.range,{fillOpacity:0.06,opacity:0.5}).addTo(groupCircle)
      try{
        map?.addLayer(groupCircle)
      }catch(error){
        //ignore map error
      }
      setGroupLayer(groupCircle)
    }
    addCircle(searchPosition.lat, searchPosition.lon)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[filterState.range, searchPosition, map])


  useEffect(()=>{
    function getAllStation(currentPos:Position, radius:number, filter:Filter) {
      console.log("CALL BACKEND FOR ALL STATION " + JSON.stringify(currentPos));
      axios.get(BACKEND_BASE_URL+ALL_STATION_URL, { params: { latitude: currentPos.lat, longitude: currentPos.lon, maxDist: radius, filter:filter } })
         .then(res => {
            const stations:GasStationPosition[] = res.data;
            setStationList(stations);
         });
    }
  
    getAllStation(searchPosition,filterState.range,{
      gas: filterState.gasFilter, 
      services: filterState.servicesFilter,
      schedules: []
    });
  },[filterState, searchPosition, setStationList])

  useEffect(()=>{
    async function getFavoriteStation(){
      if(isLogged){
        try {
          const favorite = await axiosAuth.get<GasStationPosition[]>(BACKEND_BASE_URL + FAVORITE_STATION_URL)
          setFavoriteStations(favorite.data);
        } catch (e){
          console.log(e);
        }
      }
    }
    if(isLogged) getFavoriteStation();
  },[axiosAuth, isLogged, setFavoriteStations])

  return (
    <div className='map-container'>
      <div className='grid-wrapper'>
        <div className='grid-side-menu'>
          <LeftSideMenu gasStationList={stationList} />
        </div>
        <div className='grid-map'>
          <GlobalMap markersList={stationList}/>
          <MapTool />
        </div>
      </div>
    </div>
  );
}
