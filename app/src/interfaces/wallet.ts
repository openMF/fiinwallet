import {Coin} from "./coin";

export interface Wallet {
  name: string;
  coins: Array<CoinAmount>;
  total?: number;
}

export interface CoinAmount {
  coin: Coin;
  amount: number,
}
