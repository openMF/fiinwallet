import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TransactionsHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transactions-history',
  templateUrl: 'transactions-history.html',
})
export class TransactionsHistoryPage {

  items = [
    {
      title: 'January 29 21:30',
      content: 'Compra en Starbucks en establecimiento de la Ciudad de México.',
      icon: 'calendar',
      time: { title: 'Hiciste una compra por $78.00 MXP'}
    },
    {
      title: 'Marzo 02 11:35',
      content: 'Deposito en Ventanilla en sucursal PiiWallet No. 34 "Maravillas" de la Ciudad de México.',
      icon: 'calendar',
      time: { title: 'Hiciste un deposito por $600.00 MXP'}
    },
    {
      title: 'Marzo 04 11:35',
      content: 'Deposito via SPEI con autorizacion "H1234"',
      icon: 'calendar',
      time: { title: 'Recibiste un deposito por $2,000.00 MXP'}
    },
    {
      title: 'Marzo 04 13:40',
      content: 'Compra en Toks en establecimiento de la Ciudad de México.',
      icon: 'calendar',
      time: { title: 'Hiciste una compra por $121.00 MXP'}
    }
  ]  

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionsHistoryPage');
  }

}
