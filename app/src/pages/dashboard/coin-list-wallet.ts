import {Component} from '@angular/core';
import { DashboardPage } from './dashboard';
import {AlertController, NavController, NavParams, ToastController} from "ionic-angular";
import {ApiService} from "../../services/api.service";
import {Storage} from '@ionic/storage';
import {CoinAmount, Wallet} from "../../interfaces/wallet";
import {Coin} from "../../interfaces/coin";
import {WebsocketService} from "../../services/websocket.service";

@Component({
  selector: 'page-coin-list-wallet',
  templateUrl: 'dashboard.html',
})
export class CoinListWalletPage extends DashboardPage {
  wallets: Array<Wallet> = [];
  search: boolean = true;
  currentWalletIndex: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public websocketService: WebsocketService,
              public apiService: ApiService,
              public toastCtrl: ToastController,
              private alertCtrl: AlertController) {
    super(navCtrl, navParams, storage, websocketService, apiService);
    this.currentWalletIndex = navParams.data.walletIndex;
    this.apiService.coinList.subscribe((coinList: Array<any>) => {
      const filteredList = this.filterCoinList(coinList);
      this.sortList(this.sorter);
      this.coins = filteredList;
    });
  }

  ionViewDidEnter() {
    this.storage.get('wallets').then(data => {
      if (data && data.length > 0) {
        this.wallets = data;

        this.storage.get('coin-list').then(list => {
          if (!list) {
            this.apiService.getCoinList();
          } else {
            const filteredList = this.filterCoinList(list);
            this.coins = filteredList;
          }
        });
      }
    });
  }

  private filterCoinList(coinList: Array<Coin>) {
    if (this.wallets[this.currentWalletIndex].coins.length > 0) {
      return coinList.filter(coin => {
        return !this.wallets[this.currentWalletIndex].coins.some(item => item.coin.name === coin.name);
      });
    }
    return coinList;
  }

  selectedCoin(coin) {
    let alert = this.alertCtrl.create({
      title: 'How many coins do you have?',
      inputs: [
        {
          name: 'amount',
          placeholder: 'amount',
          type: 'number',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            const value = data.amount.trim().replace(',', '.');
            if (value) {
              const walletCoin: CoinAmount = {
                coin: coin,
                amount: parseFloat(value),
              };
              console.log("NUMERO DE MONEDEROS",this.wallets.length);
              if (this.wallets.length > 0) {
                console.log("SE GUARDA");
                this.wallets[this.currentWalletIndex].coins.push(walletCoin);
                this.storage.set('wallets', this.wallets).then(() => this.navCtrl.pop());
              }
            } else {
              console.log("NO SE GUARDA");
              this.openToast('Name cannot be empty');
            }
          }
        }
      ]
    });

    alert.present();
  }

  openToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

}