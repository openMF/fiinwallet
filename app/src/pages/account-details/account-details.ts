import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SelfServiceProvider} from "../../providers/self-service/self-service";


/**
 * Generated class for the AccountDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'account-details'
})
@Component({
  selector: 'page-account-details',
  templateUrl: 'account-details.html',
})
export class AccountDetailsPage {

  accountDetails: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public self: SelfServiceProvider) {
    this.accountDetails = this.navParams.get('account');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountDetailsPage');
  }

  makeDeposit(){
    console.log('User clicked deposit button');
  }
  makeTransfer(){
    console.log('user clicked make transfer page');
  }
}
