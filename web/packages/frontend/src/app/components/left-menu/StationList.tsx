import "./StationList.scss"
import { GasStationPosition } from '@web/common/dto'
import StationListElement from './StationListElement'
import { TailSpin } from "react-loader-spinner"
import { useContext, useEffect, useState } from 'react'
import { MenuList, OptionMenuList } from "../MenuList"
import axios from "axios"
import { BACKEND_BASE_URL } from "../../const/url.const"
import { GasStationPositionContext } from "../../context/GasStationPositionContext"
import { useNavigateNoUpdates } from "../../context/RouterUtils"
import { AuthContext } from "../../context/AuthContext"

export default function StationList() {

  const [isAscending, setIsAscending] = useState(true);
  const [isPriceAscending, setIsPriceAscending] = useState(true);
  const [fuelList, setFuelList] = useState([])
  const [stationList, setStationList] = useContext(GasStationPositionContext)
  const [isLoad, setLoad] = useState(false)
  const { isLogged } = useContext(AuthContext)
  const navigate = useNavigateNoUpdates()
  const sortAddressAscending = (a: GasStationPosition, b: GasStationPosition) => {
    if (a.address < b.address) return -1;
    if (a.address > b.address) return 1;
    return 0;
  }

  const sortAddressDescending = (a: GasStationPosition, b: GasStationPosition) => {
    if (a.address > b.address) return -1;
    if (a.address < b.address) return 1;
    return 0;
  }

  const sortPriceAscending = (typeStation: string, a: GasStationPosition, b: GasStationPosition) => {
    let diffPrice = 0
    for (const gasTypeFirstElem of a.prices) {
      if (gasTypeFirstElem.gasType == typeStation) {
        for (const gasTypeElem of b.prices) {
          if (gasTypeElem.gasType == typeStation) {
            diffPrice = gasTypeElem.price - gasTypeFirstElem.price
            return diffPrice
          }
        }
      }
    }
    return 0
  }

  const sortPriceDescending = (typeStation: string, a: GasStationPosition, b: GasStationPosition) => {
    let diffPrice = 0
    for (const gasTypeFirstElem of a.prices) {
      if (gasTypeFirstElem.gasType == typeStation) {
        for (const gasTypeElem of b.prices) {
          if (gasTypeElem.gasType == typeStation) {
            diffPrice = gasTypeFirstElem.price - gasTypeElem.price
            return diffPrice
          }
        }
      }
    }
    return 0
  }


  const sortPriceUp = (a: GasStationPosition, b: GasStationPosition) => {
    const selectedGas: string = (document.getElementById("selectPrice") as HTMLInputElement).value;
    return sortPriceAscending(selectedGas, a, b)
  }

  const sortPriceDown = (a: GasStationPosition, b: GasStationPosition) => {
    const selectedGas: string = (document.getElementById("selectPrice") as HTMLInputElement).value;
    return sortPriceDescending(selectedGas, a, b)
  }
  const sortListClickByAdress = () => {
    let sortMethod = null;
    stationList.sort((a: GasStationPosition, b: GasStationPosition) => {
      isAscending ? sortMethod = sortAddressAscending : sortMethod = sortAddressDescending
      return sortMethod(a, b);
    })
    setIsAscending(!isAscending);
  }

  const sortListClickByPrice = () => {
    let sortMethod = null;
    const stations = []
    const stationsWithoutTypeGas = []
    console.log(stationList)

    const selectedGas: string = (document.getElementById("selectPrice") as HTMLInputElement).value;
    for (const e of stationList) {
      let exist = false
      for (const gas of e.prices) {
        if (gas.gasType == selectedGas) {
          stations.push(e)
          console.log(gas.gasType == selectedGas)
          exist = true
          break
        }
      }
      if (!exist) {
        stationsWithoutTypeGas.push(e)
      }
    }

    stations.sort((a: GasStationPosition, b: GasStationPosition) => {
      isPriceAscending ? sortMethod = sortPriceUp : sortMethod = sortPriceDown
      return sortMethod(a, b);
    })

    setIsPriceAscending(!isPriceAscending);
    console.log(stations.length)
    setStationList([...stations, ...stationsWithoutTypeGas])

  }
  const selectedGas: any = MenuList

  useEffect(() => {
    axios.get(BACKEND_BASE_URL + "/station/fuel-type").then((response) => {
      setFuelList(response.data);
      setLoad(true);
    })
    console.log(fuelList)
  }, [])

  return (
    <div className='stationList'>
      <h1>Stations Essences :</h1>

      {isLoad ?
        (<div>
          {isLogged && <button className="buttonStyle" onClick={()=>navigate("/favoris")}>Favoris</button>}

          <button className="buttonStyle" onClick={sortListClickByAdress}>Trier par adresse</button>
          <button className="buttonStyle" onClick={sortListClickByPrice}>Trier par prix</button>
          <select id="selectPrice">
            {fuelList.map((elt,index) => { return <option key={index} value={elt}>{elt}</option> })}
          </select>
          {stationList?.map((station: GasStationPosition) => {
            return <StationListElement key={station.id} gasStation={station} />
          })}
        </div>)
        : (
          <div>
            <h2>Chargement...</h2>
            <TailSpin color="#063d44" width={60} height={60} />
          </div>)}
    </div>
  )
}
