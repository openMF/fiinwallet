import {Injectable} from '@angular/core';
import {Socket} from "ng-socket-io";
import {Coin} from "../interfaces/coin";
import {CCC} from "../classes/cryptocompare.utils";

const TYPE = CCC.STATIC.TYPE['CURRENTAGG'];
const EXCHANGE = 'CCCAGG';

@Injectable()
export class WebsocketService {
  private subscribers: Array<any> = [];
  private watchEventSubscription: any;
  private currentPrice = {};

  constructor(private socket: Socket) {
  }

  subscribeToSocket(subscribers: Array<any>): boolean {
    this.subscribers = subscribers;
    const subscriptions: Array<any> = [];
    this.subscribers.forEach(coin => {
      subscriptions.push(`${TYPE}~${EXCHANGE}~${coin.code}~${coin.currency.code}`);
    });
    this.socket.emit('SubAdd', {subs: subscriptions});
    return true;
  }

  subscribeCoinToSocket(coin: Coin) {
    this.socket.emit('SubAdd', {subs: [`${TYPE}~${EXCHANGE}~${coin.code}~${coin.currency.code}`]});
  }

  unsubscribeCoinToSocket(coin: Coin) {
    this.socket.emit('SubRemove', {subs: [`${TYPE}~${EXCHANGE}~${coin.code}~${coin.currency.code}`]});
  }

  stopWatchEvent() {
    this.watchEventSubscription.unsubscribe();
  }

  watchEvent(callback) {
    this.watchEventSubscription = this.socket.fromEvent('m').subscribe((message: string) => {
      const messageType = message.substring(0, message.indexOf("~"));
      let res = {};
      if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {
        res = CCC.CURRENT.unpack(message);
        this.dataUnpack(res, callback);
      }
    }, data => {
      // TODO: Check what to do if there is no subscription data
      console.log('error: ', data);
    });
  }

  private dataUnpack(data, callback) {
    const from = data['FROMSYMBOL'];
    const to = data['TOSYMBOL'];
    const fsym = CCC.STATIC.CURRENCY.getSymbol(from);
    const tsym = CCC.STATIC.CURRENCY.getSymbol(to);
    const pair = from + to;

    if (!this.currentPrice.hasOwnProperty(pair)) {
      this.currentPrice[pair] = {};
    }

    for (let key in data) {
      this.currentPrice[pair][key] = data[key];
    }

    if (this.currentPrice[pair]['LASTTRADEID']) {
      this.currentPrice[pair]['LASTTRADEID'] = parseInt(this.currentPrice[pair]['LASTTRADEID']).toFixed(0);
    }
    this.currentPrice[pair]['CHANGE24HOUR'] = CCC.convertValueToDisplay(tsym, (this.currentPrice[pair]['PRICE'] - this.currentPrice[pair]['OPEN24HOUR']));
    this.currentPrice[pair]['CHANGE24HOURPCT'] = ((this.currentPrice[pair]['PRICE'] - this.currentPrice[pair]['OPEN24HOUR']) / this.currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%";

    this.displayData(this.currentPrice[pair], from, tsym, fsym, callback);
  };

  private displayData(current, from, tsym, fsym, callback) {
    const priceDirection = current.FLAGS;
    // for (let key in current) {
    //   if (key == 'CHANGE24HOURPCT') {
    //     // $('#' + key + '_' + from).text(' (' + current[key] + ')');
    //     console.log(current[key]);
    //   }
    //   // else if (key == 'LASTVOLUMETO' || key == 'VOLUME24HOURTO') {
    //   //   $('#' + key + '_' + from).text(CCC.convertValueToDisplay(tsym, current[key]));
    //   // }
    //   // else if (key == 'LASTVOLUME' || key == 'VOLUME24HOUR' || key == 'OPEN24HOUR' || key == 'OPENHOUR' || key == 'HIGH24HOUR' || key == 'HIGHHOUR' || key == 'LOWHOUR' || key == 'LOW24HOUR') {
    //   //   $('#' + key + '_' + from).text(CCC.convertValueToDisplay(fsym, current[key]));
    //   // }
    //   // else {
    //   //   $('#' + key + '_' + from).text(current[key]);
    //   // }
    // }
    //
    // // $('#PRICE_' + from).removeClass();
    // if (priceDirection & 1) {
    //   console.log('up');
    //   // $('#PRICE_' + from).addClass("up");
    // }
    // else if (priceDirection & 2) {
    //   console.log('down');
    //   // $('#PRICE_' + from).addClass("down");
    // }
    // if (current['PRICE'] > current['OPEN24HOUR']) {
    //   console.log('price up');
    //   // $('#CHANGE24HOURPCT_' + from).removeClass();
    //   // $('#CHANGE24HOURPCT_' + from).addClass("up");
    // }
    // else if (current['PRICE'] < current['OPEN24HOUR']) {
    //   console.log('price down');
    //
    //   // $('#CHANGE24HOURPCT_' + from).removeClass();
    //   // $('#CHANGE24HOURPCT_' + from).addClass("down");
    // }

    const coinCode = current['FROMSYMBOL'];
    const coin: Coin = this.subscribers.find(item => item.code === coinCode);

    if (coin) {
      const index = this.subscribers.indexOf(coin);
      if (index > -1) {
        for (let key in current) {
          if (key == 'CHANGE24HOURPCT') {
            this.subscribers[index].change = Number(current[key].replace('%', ''));
          }
          if (key == 'PRICE') {
            this.subscribers[index].price = Number(current['PRICE']);
          }
          if (key == 'LASTUPDATE') {
            this.subscribers[index].priceLastUpdated = Number(current['LASTUPDATE']);
          }
        }
      }
      // console.log(coin.name + ' : ' + coin.change);
      // console.log(coin.name + ' : ' + coin.price);
      // console.log(coin.name + ' : ' + coin.priceLastUpdated);
      callback(coin);
    }
  };
}
