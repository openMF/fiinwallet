import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers";


/**
 * Generated class for the AccountsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
    name: 'accounts',
    segment: 'accounts'
  })
@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html',
})
export class AccountsPage {

  public default: string = 'savings';
  public categories: Array<string> = ['savings', 'loan'];
  public userDetails: any = {};

  public savingsAccounts:Array<any> = [];
  public loanAccounts: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,public user: User) {
  }
  onTabChanged(tabName) {
    this.default = tabName;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountsPage');
    this.userDetails = this.user.userinfo();
    console.log(this.userDetails);


    this.setAccountDetails()
  }

  setAccountDetails(){
    this.savingsAccounts.push(this.userDetails.client);
    console.log("savings list", this.savingsAccounts);
  }

  applySavingsAccount(){
    this.navCtrl.push('apply-savings-ac');
  }

}