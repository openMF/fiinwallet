import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import { DashboardPage } from './dashboard';
import {PipesModule} from "../../pipes/pipes.module";
import {CoinListWalletPage} from "./coin-list-wallet";
import {IonicImageLoader} from "ionic-image-loader";
import {SocketIoConfig, SocketIoModule} from "ng-socket-io";
import { TranslateModule } from '@ngx-translate/core';

const config: SocketIoConfig = {url: 'wss://streamer.cryptocompare.com'};

@NgModule({
  declarations: [
    DashboardPage,
    CoinListWalletPage
  ],
  imports: [
    SocketIoModule.forRoot(config),
    IonicPageModule.forChild(DashboardPage),
    IonicPageModule.forChild(CoinListWalletPage),
    IonicImageLoader,
    PipesModule,
    TranslateModule.forChild()
  ],
})
export class DashboardPageModule {
}