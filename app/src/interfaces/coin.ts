import {Currency} from "./currency";

export interface Coin {
  name: string;
  code: string;
  imageUrl: string;
  order: string;
  currency: Currency,
  price: number;
  priceLastUpdated: number;
  change: number;
  marketcap: number;
}
