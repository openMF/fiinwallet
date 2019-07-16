import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from "rxjs/Subject";
import {Storage} from "@ionic/storage";
import {Currency} from "../interfaces/currency";
import {currencies} from "../classes/currencies";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Coin} from "../interfaces/coin";

const COINAMOUNT = null;
const BATCHSIZE = 60;

@Injectable()
export class ApiService {
  coinList: Subject<Array<Coin>> = new Subject<Array<Coin>>();
  indexStart: number = 0;
  currencyList: Object = {};
  pricePromises = [];
  isLoading: boolean = false;
  refresher: any;
  coinHistoryPriceList = new Subject();
  coinHistoryPriceListJS = new Subject();
  storedCurrency: BehaviorSubject<Currency>;
  currentCurrency: Currency;

  // TODO Do something when the api is down

  static renderPriceHistory(historyData): any {
    return historyData.map(minuteObject => {
      return {
        name: minuteObject.time,
        value: minuteObject.close
      }
    });
  }

  static renderPriceHistoryChartJSLabel(historyData): any {
    return historyData.map(minuteObject => {
      return minuteObject.time;
    });
  }

  static renderPriceHistoryChartJSValue(historyData): any {
    return historyData.map(minuteObject => {
      return minuteObject.close;
    });
  }

  constructor(private http: HttpClient, private storage: Storage) {
    this.storedCurrency = new BehaviorSubject<Currency>(currencies.find(item => item.code === 'USD'));

    this.storage.get('currency').then(currency => {
      if (currency) {
        this.storedCurrency.next(currency);
      }
    });

    this.storedCurrency.subscribe(item => {
      this.currentCurrency = item;
    })
  }

  static getCurrencieCodes() {
    return currencies.map(item => item.code).join();
  }

  saveCurrency(currency) {
    this.storage.set('currency', currency);
    this.storedCurrency.next(currency);
    this.getCoinList();
  }

  private callCoinList() {
    return this.http.get('https://min-api.cryptocompare.com/data/all/coinlist');
  }

  private callPriceList(coins) {
    return this.http.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coins}&tsyms=${this.currentCurrency.code}&e=CCCAGG`); // TODO: fix currency to dynamic
  }

  getPriceHistoryHour(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histominute?fsym=${code}&tsym=${this.currentCurrency.code}&limit=60&aggregate=1&e=CCCAGG`);
    this.getPriceDataChartJS(url, coin);
  }

  getPriceHistoryDay(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histominute?fsym=${code}&tsym=${this.currentCurrency.code}&limit=1440&aggregate=30&e=CCCAGG`);
    this.getPriceDataChartJS(url, coin);
  }

  getPriceHistoryWeek(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histohour?fsym=${code}&tsym=${this.currentCurrency.code}&limit=168&aggregate=1&e=CCCAGG`);
    this.getPriceDataChartJS(url, coin);
  }

  getPriceHistoryMonth(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histoday?fsym=${code}&tsym=${this.currentCurrency.code}&limit=30&aggregate=1&e=CCCAGG`);
    this.getPriceDataChartJS(url, coin);
  }

  getPriceHistoryYear(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histoday?fsym=${code}&tsym=${this.currentCurrency.code}&limit=365&aggregate=1&e=CCCAGG`);
    this.getPriceDataChartJS(url, coin);
  }

  getPriceHistoryAll(coin) {
    const code = coin.code;
    const url = this.http.get(`https://min-api.cryptocompare.com/data/histoday?fsym=${code}&tsym=${this.currentCurrency.code}&aggregate=1&e=CCCAGG&allData=true`);
    this.getPriceDataChartJS(url, coin);
  }

  getCoinList() {
    if (!this.refresher) {
      this.isLoading = true;
    }
    this.callCoinList().subscribe(
      data => {
        const coinMarketCoinList = data;
        const baseImageUrl = coinMarketCoinList['BaseImageUrl'];
        const coinListJson = coinMarketCoinList['Data'];
        let listOfCoinProperties = Object.keys(coinListJson).filter(coin => !(coin.indexOf('*') > -1));
        if (COINAMOUNT) {
          listOfCoinProperties.length = COINAMOUNT;
        }
        this.getPricesPerBatchSize(listOfCoinProperties, BATCHSIZE);
        this.prepareCoinList(listOfCoinProperties, coinListJson, baseImageUrl);
      },
      err => console.error(err),
      () => console.log('done loading coins')
    );
  }

  private prepareCoinList(listOfCoinProperties: string[], coinListJson: any, baseImageUrl: any) {
    Promise.all(this.pricePromises).then(() => {
      const coinList: Array<Coin> = listOfCoinProperties.filter(coin => {
        return this.checkForEmptyCoins(coinListJson, coin);
      }).map(coin => {
        return this.mapToCoin(coinListJson, coin, baseImageUrl);
      }).filter(coin => {
        return !!coin.marketcap && !!coin.change;
      });
      this.isLoading = false;
      this.indexStart = 0;
      if (this.refresher) {
        this.refresher.complete();
        this.refresher = null;
      }
      this.coinList.next(coinList);
      this.updateWallets(coinList);
    }, err => console.error(err));
  }

  private updateWallets(coinList) {
    this.storage.get('wallets').then((wallets) => {
      if (wallets && wallets.length > 0) {
        wallets.forEach(wallet => {
          wallet.coins.forEach(walletItem => {
            walletItem.coin = coinList.find(coin => {
              return coin.name === walletItem.coin.name;
            });
          })
        });
        this.storage.set('wallets', wallets);
      }
    });
  }

  private mapToCoin(coinListJson: any, coin, baseImageUrl: any): Coin {
    const coinObject = coinListJson[coin];
    const currencies = this.mapCurrencies(coin);
    return Object.assign({
      name: coinObject['CoinName'],
      code: coinObject['Symbol'],
      imageUrl: baseImageUrl + coinObject['ImageUrl'],
      order: coinObject['SortOrder'],
    }, currencies[this.currentCurrency.code]);
  }

  private checkForEmptyCoins(coinListJson: any, coin) {
    const coinObject = coinListJson[coin];
    const hasName = coinObject.hasOwnProperty('CoinName') && !!coinObject['CoinName'];
    const hasUrl = coinObject.hasOwnProperty('Url') && !!coinObject['Url'];
    const hasImage = coinObject.hasOwnProperty('ImageUrl') && !!coinObject['ImageUrl'];
    const hasPrice = this.currencyList[coin] && !!this.currencyList[coin][this.currentCurrency.code];
    const notSponsored = coinObject.hasOwnProperty('Sponsored') && !coinObject['Sponsored'];
    return hasName && hasUrl && hasImage && hasPrice && notSponsored;
  }

  private getPricesPerBatchSize(listOfCoinProperties, batchSize) {
    const range = this.indexStart + batchSize;
    const shortCoinNames = listOfCoinProperties.slice(this.indexStart, range);
    const priceList = this.callPriceList(shortCoinNames.join()).toPromise();
    this.pricePromises.push(new Promise((resolve, reject) => {
      priceList.then(
        data => {
          Object.assign(this.currencyList, data['RAW']);
          resolve();
        }
      );
    }));

    this.indexStart += batchSize + 1;
    if (range < listOfCoinProperties.length) {
      this.getPricesPerBatchSize(listOfCoinProperties, batchSize);
    }
  }

  private mapCurrencies(coin): any {
    if (this.currencyList[coin]) {
      const currencies = this.currencyList[coin];
      for (let currency in currencies) {
        if (currencies.hasOwnProperty(currency)) {
          currencies[currency] = {
            currency: this.currentCurrency,
            price: currencies[currency]['PRICE'],
            priceLastUpdated: currencies[currency]['LASTUPDATE'],
            change: currencies[currency]['CHANGEPCT24HOUR'], //TODO Check if i get the correct change. Check websocket!
            marketcap: currencies[currency]['MKTCAP'],
          };
        }
      }
      return currencies;
    }
  }

  refreshCoinList(refresher) {
    this.refresher = refresher;
    setTimeout(() => this.getCoinList(), 500);
  }

  private getPriceData(url, coin) {
    url.subscribe(
      data => {
        const historyData = data['Data'];
        this.coinHistoryPriceList.next([
          {
            "name": coin.name,
            "series": ApiService.renderPriceHistory(historyData)
          },
        ]);
      },
      err => console.error(err),
      () => console.log('done loading chart')
    );
  }

  private getPriceDataChartJS(url, coin) {
    setTimeout(() => {
      url.subscribe(
        data => {
          const historyData = data['Data'];

          this.coinHistoryPriceListJS.next({
            labels: ApiService.renderPriceHistoryChartJSLabel(historyData),
            data: ApiService.renderPriceHistoryChartJSValue(historyData)
          });
        },
        err => console.error(err),
        () => console.log('done loading chart')
      );
    }, 500);
  }
}
