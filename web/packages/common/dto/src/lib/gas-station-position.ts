import { GasPrice } from './gas-price';
import { Position } from './position';

export interface GasStationPosition {
  id: string;
  position: Position;
  address:string;
  prices:GasPrice[]
}
