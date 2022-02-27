import React from 'react'

export default function CustomerPosition({onButtonClick}:
                                   {onButtonClick: (long: number, lat: number)=>void}) {

  const long  = 2;
  const lat  =  2;

  return (
    <div>
      <button onChange={(e)=>{
             onButtonClick(long, lat) }} > LE BOUTON </button>

      Showing Position : {long} : {lat}
    </div>
  )
}
