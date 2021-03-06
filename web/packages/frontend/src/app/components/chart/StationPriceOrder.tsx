import { useContext, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BACKEND_BASE_URL } from '../../const/url.const';
import axios from 'axios';
import { FuelStationPriceOrder } from '@web/common/dto';
import { FilterStationContext } from '../../context/FilterStationContext';
import "./StationPriceOrder.scss"
import { GeolocalisationContext } from '../../context/GeolocalisationContext';
import { useNavigateNoUpdates } from '../../context/RouterUtils';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export default function StationPriceOrder() {
  const [stationFuelPrice, setStationFuelPrice] = useState<FuelStationPriceOrder[]>([])
  const { filterState } = useContext(FilterStationContext)
  const {searchPosition} = useContext(GeolocalisationContext)
  const navigate = useNavigateNoUpdates()

  useEffect(() => {
    axios.get(BACKEND_BASE_URL + "/chart/fuels-station-order-price",
      {
        params:
        {
          latitude: searchPosition.lat,
          longitude: searchPosition.lon,
          maxDist: filterState.range,
          filter: {
            gas: filterState.gasFilter,
            services: filterState.servicesFilter,
            schedules: []
          },
          maxStation: 10
        }
      }).then((response) => setStationFuelPrice(response.data))
  }, [filterState, searchPosition]
  )


  return (<div className='wrapper-station-chart'>{
    stationFuelPrice.map(fuel => {
      const labels = fuel.stations.map((station: { address: any; }) => station.address.substring(0, 25));
      const values = fuel.stations.map((station: { price: any; }) => station.price);
      const data = {
        labels: labels,
        datasets: [{
          label: "Prix",
          data: values,
          backgroundColor: 'rgba(80, 99, 255, 0.5)',
        }]
      }
      const options = {
        responsive: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: `Top station pour le ${fuel.fuel}`,
          }
        },
        scales: {
          y: {
            beginAtZero: false
          },
        },
        onClick:(_: any,elt: { index: number; }[])=>{
          if(elt.length===1){
            navigate("/station/"+fuel.stations[elt[0].index].idStation)
          }
        }


      };
      return <Bar key={fuel.fuel} width="500px" height="450px" className='wrapper-station-chart-element' options={options} data={data} />
    })
  }
  </div>)


}
