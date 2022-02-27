import "../left-menu/LeftSideMenu.scss"
import { GasStationPosition } from '@web/common/dto'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { FRONT_STATION_ID } from '../../const/url.const'
import StationList from "../left-menu/StationList";
import StationDetailed from "../left-menu/StationDetailed";

export default function FavStationMenu({gasStationList}:{gasStationList:GasStationPosition[]}) {
  return (
    <div className='sideMenu'>
      <span>STATIONS FAVORITES</span>
      <Routes>
        <Route path="/" element={<StationList stationList={gasStationList}/>}/>
        <Route path={FRONT_STATION_ID+":id"} element={<StationDetailed/>}/>
      </Routes>
    </div>
  )
}
