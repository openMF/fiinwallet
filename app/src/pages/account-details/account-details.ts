import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { User } from "../../providers";
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

  public accountId: any;
  public accountDetails: any;
  public activeAccount: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,public user:User,
     public self: SelfServiceProvider, public loadingCtrl: LoadingController ) {
    this.accountId = this.navParams.get('account');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountDetailsPage');
    this.setAccountDetails();
  }

  setAccountDetails(){
    let loader = this.loadingCtrl.create({
     content: 'Please wait...'
    });
    loader.present();
    this.self.getSATransactions({"key": this.user.userinfo().authentication.base64EncodedAuthenticationKey,
                            "id" : this.accountId })
      .subscribe(() => {
        this.accountDetails = this.self.listSATransactions();
        this.activeAccount = this.accountDetails.status.active;
        loader.dismiss();
        console.log('Got the account details', this.accountDetails);
      }, err =>{
        loader.dismiss();
        alert('Error occured');
      });

  }

  viewTransactions(){
    if (this.activeAccount){
      console.log('Get to view transactions ');
      console.log(this.accountDetails.transactions);
      this.navCtrl.push('transactions', {transactions: this.accountDetails.transactions});
    } else {
      console.log('cant view transactions as account is inactive ');
    }
   
  }
  viewCharges(){
    if (this.activeAccount){
      console.log('Get to view charges ');
    } else {
      console.log('cant view charges as account is inactive ');
    }
  }
  viewQr(){
    if (this.activeAccount){
      console.log('try to load qr ');
    } else {
      console.log('account is inactive ');
    }
  }
}
