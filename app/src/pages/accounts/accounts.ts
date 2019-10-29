import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import {User} from "../../providers";
import {SelfServiceProvider} from "../../providers/self-service/self-service";

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

  public savingsAccountsList: any;
  public loanAccountsList: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public user: User
    ,public loadingCtrl: LoadingController, public self: SelfServiceProvider) {
  }
  onTabChanged(tabName) {
    this.default = tabName;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountsPage');


    this.setAccountsList()
  }

  setAccountsList(){
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.self.getAccounts({"key": this.user.userinfo().authentication.base64EncodedAuthenticationKey,
                            "clientId" : this.user.userinfo().client.id })
      .subscribe(() => {
        this.savingsAccountsList = this.self.listAccounts().savingsAccounts;
        this.loanAccountsList = this.self.listAccounts().loanAccounts;
        console.log(this.self.listAccounts());
        loader.dismiss();
        console.log('Inside the promise')
      }, err =>{
        loader.dismiss();
        alert('Error occured');
      });
    console.log("this page accountslist", this.savingsAccountsList);
  }

  applySavingsAccount(){
    this.navCtrl.push('apply-savings-ac');
  }

  viewAccountDetails(){
    this.navCtrl.push('account-details');
  }

}