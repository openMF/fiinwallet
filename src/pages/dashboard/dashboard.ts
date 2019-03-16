import {Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Content, IonicPage, Item, ItemSliding, NavController, NavParams, VirtualScroll} from 'ionic-angular';
import {ApiService} from "../../services/api.service";
import {StatementAccountPage} from "../statement-account/statement-account";
import {Storage} from "@ionic/storage";
import {ComparisonUtils} from "../../classes/comparison.utils";
import {Coin} from "../../interfaces/coin";
import {WebsocketService} from "../../services/websocket.service";

const SORTERS = [
  {
    name: 'Popular',
    value: 'popular'
  },
  {
    name: 'Price',
    value: 'price'
  },
  {
    name: 'Market Cap',
    value: 'marketcap'
  },
];

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  search: boolean = false;
  coins: Array<Coin> = [];
  favorites: Array<Coin> = [];
  list: Array<Coin> = [];
  listView: any;
  coinsSearchList: any;
  sorter: any;
  sorters: any = SORTERS;
  listLoaded: boolean = false;
  userActivated: boolean = false;
  searchTerm: string = '';
  subscriptionToSocket: boolean = false;
  delayedAnimation: any;
  user: any;  

  @ViewChild(VirtualScroll) virtualList: VirtualScroll;
  @ViewChild(Content) content: Content;
  @ViewChildren(ItemSliding) itemSlidings: QueryList<ItemSliding>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public websocketService: WebsocketService,
              public apiService: ApiService) {
    this.user = navParams.get('user');
    console.log("EL USUARIO EN DASHBOARD  ES ", this.user);                    
    this.apiService.coinList.subscribe(coinList => {
      this.coins = this.removeFavorites(coinList);
      if (this.isCoinsView()) {
        this.list = this.coins;
      }
      this.sortList(this.sorter);
      this.storage.set('coin-list', coinList);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    this.listView = 'favorites';
    this.list = this.favorites;
    this.retrieveFavoritesFromStorage();
    this.retrieveSorterFromStorage();
  }

  ionViewDidEnter() {
    if (this.subscriptionToSocket && !this.isCoinsView()) {
      this.websocketService.watchEvent(updatedCoin => {
        this.watchCoinUpdate(updatedCoin);
      });
    }
  }

  ionViewDidLeave() {
    this.websocketService.stopWatchEvent();
  }

  get listIsEmpty(): boolean {
    if (this.listLoaded) {
      return !this.isCoinsView() && this.list.length === 0;
    }
    return false;
  }

  get userIsActive(): boolean {    
    return this.user.client.active;
  }

  goToAllCoins() {
    this.listView = 'coins';
    this.delayedAnimation = setTimeout(() => {
      this.openItemAnimated(this.itemSlidings.first, this.itemSlidings.first.item);
    }, 1500);
  }

  goToActivateCountryOfBirthPage() {
    this.navCtrl.push('CountryOfBirthPage',this.user);
  }

  private retrieveSorterFromStorage() {
    this.storage.get('sorter').then(sorter => {
      sorter ? this.sorter = sorter : this.sorter = 'popular';
    });
  }

  private retrieveFavoritesFromStorage() {
    this.storage.get('favorites').then(list => {
      list ? this.list = this.favorites = list : [];
      this.sortList(this.sorter);
      this.subscribeFavoritesToSocket();
      this.retrieveCoinsFromStorage();
    });
  }

  private subscribeFavoritesToSocket() {
    this.subscriptionToSocket = this.websocketService.subscribeToSocket(this.favorites);
    this.websocketService.watchEvent(updatedCoin => {
      this.watchCoinUpdate(updatedCoin);
    });
  }

  private watchCoinUpdate(updatedCoin) {
    const listItem = this.itemSlidings.find(item => {
      if (item.item.getLabelText().trim()) {
        const name = item.item.getLabelText().trim();
        return name === updatedCoin.name;
      }
      return false;
    });
    if (listItem) {
      listItem.item.getNativeElement().classList.add('ping');
      setTimeout(() => {
        listItem.item.getNativeElement().classList.remove('ping');
      }, 750);
    }
    this.sortList(this.sorter);
  }

  private retrieveCoinsFromStorage() {
    this.storage.get('coin-list').then(list => {
      if (list) {
        list = this.removeFavorites(list);
        this.coins = list;
        this.sortList(this.sorter);
      } else {
        this.apiService.getCoinList();
      }
      this.listLoaded = true;
    });
  }

  private removeFavorites(list) {
    return list.filter(coin => {
      return !this.favorites.some(favorite => favorite.name === coin.name);
    });
  }

  private isCoinsView(): boolean {
    return this.listView === 'coins';
  }

  filterCoinsOnSearch(event) {
    this.coinsSearchList = this.coins;
    let value = event.target.value;

    if (value && value.trim() != '') {
      this.list = this.coinsSearchList.filter((item) => {
        return (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
      });
    } else {
      this.list = this.coins;
    }
  }

  listHasCoins(): string {
    return this.list.length > 0 ? 'visible' : 'hidden';
  }

  sorterChanged(event) {
    this.sortList(event);
    this.storage.set('sorter', event);
  }

  listChanged(event) {
    this.list = [];
    this.updateVirtualList(() => {
      switch (event.value) {
        case 'favorites':
          this.list = this.favorites;
          if (this.delayedAnimation) {
            clearTimeout(this.delayedAnimation);
          }
          this.websocketService.watchEvent(updatedCoin => {
            this.watchCoinUpdate(updatedCoin);
          });
          break;
        case 'coins':
          this.list = this.coins;
          this.websocketService.stopWatchEvent();
          break;
        default:
          this.list = this.coins;
          this.websocketService.stopWatchEvent();
          break;
      }
    });
    this.sortList(this.sorter);
    this.content.scrollToTop();
  }

  updateVirtualList(callBack) {
    this.virtualList.writeUpdate(true);
    callBack();
    this.virtualList.renderVirtual(true);
    this.virtualList.readUpdate(true);
    this.virtualList.resize();
  }

  openItemAnimated(itemSlide: ItemSliding, item: Item) {
    itemSlide.setElementClass("active-sliding", true);
    itemSlide.setElementClass("active-slide", true);
    itemSlide.setElementClass("active-options-right", true);
    item.setElementStyle("transform", "translate3d(-80px, 0px, 0px)");
    setTimeout(() => {
      itemSlide.close();
    }, 1000);
  }

  sortList(sorter) {
    switch (sorter) {
      case 'popular':
        this.list.sort(ComparisonUtils.compareOrder);
        break;
      case 'price':
        this.list.sort(ComparisonUtils.comparePrices);
        break;
      case 'marketcap':
        this.list.sort(ComparisonUtils.compareMarketCap);
        break;
      default:
        this.list.sort(ComparisonUtils.compareOrder);
        break;
    }
  }

  get coinListLength(): string {
    return this.coins ? this.coins.length.toString() : '0';
  }

  get isLoading(): boolean {
    return this.apiService.isLoading;
  }

  selectedCoin(coin): void {
    this.navCtrl.push(StatementAccountPage, coin);
  }

  trackByCoin(index, item): number {
    return item.name;
  }

  detectChange(priceChange): boolean {
    return priceChange < 0;
  }

  doRefresh(refresher) {
    this.apiService.refreshCoinList(refresher);
  }

  addToFavorites(item, coin) {
    this.favorites.push(coin);
    this.websocketService.subscribeCoinToSocket(coin);
    console.log("SE AGREGA A FAVORITOS");
    this.storage.set('favorites', this.favorites);
    this.list = [];
    this.updateVirtualList(() => {
      this.list = this.coins = this.coins.filter(item => item.name !== coin.name);
    });
    console.log("SE AGREGO A FAVORITOS");
    item.close();
    this.searchTerm = '';
  }

  removeFromFavorites(item, coin) {
    const index = this.favorites.indexOf(coin);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
    this.storage.set('favorites', this.favorites);
    this.coins.push(coin);

    if (this.favorites.length > 0) {
      this.websocketService.unsubscribeCoinToSocket(coin);
    } else {
      this.websocketService.stopWatchEvent();
    }
    item.close();
  }
}