import "./GlobalMap.scss"
import { GasStationPosition } from '@web/common/dto';
import { useContext, useMemo } from 'react';
import {MapContainer, TileLayer, ZoomControl} from 'react-leaflet';
import MapMarker from './MapMarker';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import PositionUpdater from "./PositionUpdater";
import { MapContext } from "../context/MapContext";
import { Map } from "leaflet";
import { ThemeContext } from "../context/ThemeContext";
import { GeolocalisationContext } from "../context/GeolocalisationContext";

export default function GlobalMap({markersList}:
{markersList:GasStationPosition[]})
{
  const {isDarkTheme} = useContext(ThemeContext)
  const mapTheme = useMemo(()=>{
    if(isDarkTheme){
      return  {
          attribution:'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
          url:"https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      }
    }
    return{
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    }
  },[isDarkTheme])
  const [position,setPosition] = useContext(GeolocalisationContext)
  
  const [map,setMap]:[Map,any] = useContext(MapContext);
    return(
        <div id='map' className='mapDisplayer'>
            <MapContainer center={[position.lat,position.lon]} zoom={13} zoomControl = {false} scrollWheelZoom={false} whenCreated={setMap}>
              <PositionUpdater />
              <TileLayer
                attribution={mapTheme.attribution}
                url={mapTheme.url}
                />
                <ZoomControl position = "bottomright"/>
                <MarkerClusterGroup >
                  {markersList.map((value,index) => {return (<MapMarker key={value.id} gasStation={value} />)})}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
}
