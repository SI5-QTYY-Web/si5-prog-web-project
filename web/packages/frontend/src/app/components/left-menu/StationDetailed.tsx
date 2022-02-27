import "./StationDetailed.scss"
import { GasStationInfo, UserIssue } from '@web/common/dto';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {BACKEND_BASE_URL, REPORT_ISSUE, STATION_INFO, UPDATE_FAVORITE_STATION_URL} from '../../const/url.const';
import {TailSpin} from 'react-loader-spinner'
import { useNavigateNoUpdates } from "../../context/RouterUtils";
import {AuthContext} from "../../context/AuthContext";
import { MapContext} from "../../context/MapContext";
import L from "leaflet";
import { Map } from 'leaflet';
import { DrawContext } from "../../context/DrawContext";
import 'leaflet-routing-machine';

import { GeolocalisationContext } from "../../context/GeolocalisationContext";

export default function SideMenu() {
  const navigate = useNavigateNoUpdates()
  const [gasStationInfo,setGasStationInfo] = useState<GasStationInfo>();
  const {id} = useParams();
  const {userPosition,searchPosition,setSearchPosition} = useContext(GeolocalisationContext)
  const {token, user, favoriteStations, setFavoriteStations} = useContext(AuthContext)

  function getStationInfo(stationId:string) {
    console.log("GET STATION INFO FOR "+stationId)

    axios.get(BACKEND_BASE_URL+STATION_INFO+"/"+stationId)
       .then(res => {
          setGasStationInfo(res.data);
       });
  }
  function reportStationIssue(stationId:string,reportMSG:string){
    console.log("REPORT ISSUE FOR STATION "+stationId)
    const message:UserIssue = {stationId:stationId, userMsg:reportMSG}

    axios.post(BACKEND_BASE_URL+REPORT_ISSUE,{issue:message})
       .then(res => {
        window.alert("Votre problème a bien été envoyé")
      }).catch((error)=>{
        window.alert("Impossible d'envoyer votre problème, Veuillez réessayer")
      });
  }

  function onBackClick(){
    navigate("/");
  }

  function onUserReportClick(id : string){
    const msg = prompt("Quel est votre problème ?");
    if(msg){
      reportStationIssue(id,msg)
    }
  }
  function onItineraireClick(){
    addNavigation()
  }
  const [map,setMap]:[Map, any] = useContext(MapContext);
  const [groupLayer, setGroupeLayer,groupNavLayer,setNavGroupLayer] = useContext(DrawContext)

  const addNavigation = () =>{
    if (groupNavLayer){
      map.removeControl(groupNavLayer)
    }
    setNavGroupLayer(L.Routing.control({
      routeWhileDragging: true,
      //sshowAlternatives: true,
        waypoints: [
            L.latLng(userPosition.lat, userPosition.lon),
            L.latLng(searchPosition.lat,searchPosition.lon)
        ]
    }).addTo(map))
    
  }
  useEffect(()=>{
    if(id)
      getStationInfo(id);
    else
      console.error("NO ID FOUND");
  },[id])

  /**
   * To add the current station to the favorite stations of the user
   */
  function addFavoriteStation(){
    if(user!=''){
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log("entering favorites : " , (!favoriteStations.some((e: GasStationInfo) => e.id === gasStationInfo.id)));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      //if the array already contains this favorite, then we do not add it
      if(!favoriteStations.some((e: GasStationInfo) => e.id === gasStationInfo.id)){
        const newFavoriteStations = favoriteStations;
        console.log(newFavoriteStations);
        newFavoriteStations.push(gasStationInfo);
        setFavoriteStations(newFavoriteStations);
        setNewFavorite().then(
          res => {
            console.log('Favorites updated for current user !')
          }
        );
      } else {
        console.log('Already added to favorites !');
      }
    }
    console.log('lets see current favorites : ', favoriteStations);
  }

  async function setNewFavorite(){
    if(user!=''){
      console.log("CALL BACKEND FOR FAVORITE STATION OF ", user);
      try {
        console.log('route used : ', BACKEND_BASE_URL + UPDATE_FAVORITE_STATION_URL);
        const favorite = await axios.post(BACKEND_BASE_URL + UPDATE_FAVORITE_STATION_URL,
          {headers: {
              Authorization: 'Bearer ', token
            },
            body:    {favoriteStations}
          });
        console.log('favorite stations updated !');
      } catch (e){
        console.log(e);
      }
    }
  }

  return(
    <div className='stationDetailed'>
        <h1>{gasStationInfo?.address||"chargement..."}</h1>
        <h3>{gasStationInfo?.id||"chargement..."}</h3>

        <div className='subInfo'>
          <h2>Essences</h2>
          {gasStationInfo? gasStationInfo.prices.map((value) => {
            const priceText = value.gasType+" : "+value.price+"€";
            return (<p key={value.gasType}>{priceText}</p>)
          }):
          <TailSpin color="#063d44" width={60} height={60}/>}
        </div>

        <div className='subInfo'>
          <h2>Services disponibles</h2>
          <ul>
            {gasStationInfo? gasStationInfo.services.map((service) => {return (<li key={service}>{service}</li>)})
            :<TailSpin color="#063d44" width={60} height={60}/>}
          </ul>
        </div>

        <div className='subInfo'>
          <h2>Horaire</h2>

            {gasStationInfo?
              ((gasStationInfo.schedules.length !== 0) ?
                (<ul>
                  {gasStationInfo.schedules.map((schedule) => {
                    const scheduleText = schedule.day + (schedule.openned? " ouvert ":" fermé ");
                    return (
                      <li key={schedule.day}>
                        <p>{scheduleText}</p>
                        {schedule.hourSchedule && schedule.hourSchedule.map((hour)=>{
                          return (<p key={hour.openHour}>de {hour.openHour} à {hour.closedHour}</p>);
                        })}
                      </li>)}
                  )}
                </ul>)
                : (<p>Pas d'informations disponibles</p>))
            :<TailSpin color="#063d44" width={60} height={60}/>}
        </div>
        <button className='buttonStyle' onClick={(e)=>{addFavoriteStation()}}>Ajouter la station aux favoris</button>
        <button className='buttonStyle' onClick={(e)=>{onBackClick()}} >{"<< Liste des stations"}</button>
        <button className='buttonStyleRed' onClick={(e)=>{onUserReportClick(gasStationInfo?.id!)}} >Signaler un problème</button>
        <button className='buttonStyle' onClick={(e)=>{onItineraireClick()}} >Calculer un itineraire</button>
    </div>
    );
}
